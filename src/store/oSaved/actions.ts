import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";
import { removeFromAsyncStorage } from "../../storage/asyncStorage";
import * as defaultConstants from "./defaultContants";
import { Context } from "../overmind";
import { SavedTVShowsDoc } from "./state";
import { DateObject } from "@markmccoid/tmdb_api";
import { getCurrentDate, formatDateObjectForSave } from "../../utils/helperFunctions";

export const internal = internalActions;
// export actions for saved filters.
export * from "./actionsSavedFilters";

//*================================================================
//* - INITIALIZE (Hydrate Store)
//*================================================================
export const hydrateStore = async (
  { state, actions, effects }: Context,
  { uid, forceRefresh = false }: { uid: string; forceRefresh: boolean }
) => {
  //Used in View Movies to "know" when loading is complete
  state.oAdmin.appState.hydrating = true;

  let userDocData = await effects.oSaved.initializeStore(uid, forceRefresh);

  state.oSaved.savedTVShows = validateSavedTVShows(userDocData.savedTVShows);
  state.oSaved.tagData = userDocData.tagData;
  state.oSaved.savedFilters = userDocData.savedFilters;
  //Update the datasource (loaded from local or cloud(firestore))
  state.oAdmin.appState.dataSource = userDocData.dataSource;
  // Tag data is stored on the movies document.  This function creates the
  // oSaved.taggedMovies data structure within Overmind
  actions.oSaved.internal.createTaggedTVShowsObj(userDocData.savedTVShows);
  //------------
  // SETTINGS
  // loading all settings from state first(holds any defaults), then settings in firestore
  // this will allow the settings that have been set to override the defaults
  // NOTE: must do each nested setting individually since some are nested objects or arrays
  const baseSortCount = state.oSaved.settings.defaultSort.length;
  const storedSortCount = userDocData?.settings?.defaultSort?.length || 0;
  // If the number of sort Items stored is different from the default, just keep the default
  // Yes, this will wipe out any stored sort.
  if (baseSortCount === storedSortCount) {
    state.oSaved.settings.defaultSort = userDocData?.settings?.defaultSort;
  }

  state.oSaved.settings.defaultFilter = userDocData?.settings?.defaultFilter;

  // Copy over default sort. This is future proofing, in case we want to let user change current sort on the fly.
  state.oSaved.currentSort = [...state.oSaved.settings?.defaultSort];

  // If the defaultFilter id doesn't exist in the savedFilters array, then delete the default filter.
  if (!state.oSaved.savedFilters.some((el) => el.id === state.oSaved.settings.defaultFilter)) {
    state.oSaved.settings.defaultFilter = null;
    // Save data to local
    await effects.oSaved.localSaveSettings(uid, state.oSaved.settings);
    // -- COMMENT OUT FIRESTORE
    // Save to firestore
    // await effects.oSaved.saveSettings(state.oSaved.settings);
  }

  // Apply a default filter, if one has been selected in settings and we are not doing a forced refresh
  const defaultFilterId = state.oSaved.settings?.defaultFilter;
  if (defaultFilterId && !forceRefresh) {
    //Apply default Filter
    actions.oSaved.applySavedFilter(defaultFilterId);
  }
  // Get movie genres from savedTVShows objects
  state.oSaved.generated.genres = getGenresFromTVShows(state.oSaved.savedTVShows);
  state.oAdmin.appState.hydrating = false;
};

//*================================================================
//* - Reset oSaved on user Logout
//*================================================================
export const resetOSaved = async ({ state, effects, actions }: Context) => {
  state.oSaved.savedTVShows = [];
  state.oSaved.tagData = [];
  state.oSaved.taggedTVShows = {};
  state.oSaved.settings = {
    defaultFilter: undefined,
    defaultSort: defaultConstants.defaultSort,
  };
  // state.oSaved.filterData = {};
  actions.oSaved.clearFilterScreen();
  state.oSaved.savedFilters = [];
  state.oSaved.generated.genres = [];
};

//*================================================================
//* - MOVIE (state.savedTVShows) Actions
//*================================================================
/**
 * Refresh Movie
 *  Will update movies data IF title, releaseDate, imdbId or status has changed.
 *  Also checks to see if the savedDate property is on the movie in question (internal field)
 *  If not it will add a savedDate: date.now() to the movie.
 *
 */
//! NEXT - Lots of duplicate stuff from saving tv show.  What can be combined.
//! ALSO maybe just update whole saved movie record instead of trying to see if anything has changed.
export const refreshTVShow = async ({ state, effects, actions }: Context, tvShowId) => {
  // Get the lastest data from the API for the passed tvShowId
  // get more movie details from tmdbapi
  const { data: latestMovieDetails } = await effects.oSaved.getTVShowDetails(tvShowId);
  // Make sure date isn't undefined and store only epoch and formatted
  //! --- commented out
  // let epoch = latestMovieDetails?.releaseDate?.epoch || "";
  // let formatted = latestMovieDetails?.releaseDate?.formatted || "";
  // latestMovieDetails.releaseDate = { epoch, formatted };

  // Get current saved movie
  const currentMovieDetails = { ...state.oSaved.getTVShowDetails(tvShowId) };

  // We will build updateObj and then update if not undefined
  let updateObj = undefined;
  let returnMessage = "Movie Up To Date\n";

  //These are the field we are checking.
  const fieldsToCheck = {
    titleMatch: latestMovieDetails.name === currentMovieDetails.name,
    releaseDateMatch:
      latestMovieDetails.releaseDate.epoch === currentMovieDetails?.releaseDate?.epoch,
    imdbIdMatch: latestMovieDetails.imdbId === currentMovieDetails.imdbId,
    statusMatch: latestMovieDetails.status === currentMovieDetails.status,
    posterMatch:
      latestMovieDetails?.posterURL?.length > 0 &&
      !(currentMovieDetails?.posterURL?.length > 0),
  };
  const { titleMatch, releaseDateMatch, imdbIdMatch, statusMatch, posterMatch } =
    fieldsToCheck;
  // if any of our fields we are checking don't Check, refresh
  // only update poster or backdrop URLs if they are empty on currentMovieDetails
  if (!titleMatch || !releaseDateMatch || !imdbIdMatch || !statusMatch || posterMatch) {
    returnMessage += `${!titleMatch && "- Title Updated - "}`;
    returnMessage += `${!releaseDateMatch && "- Release Date Updated - "}`;
    returnMessage += `${!imdbIdMatch && "- imdb ID Updated - "}`;
    returnMessage += `${!statusMatch && "- Status Updated - "}`;
    returnMessage += `${!posterMatch && "- Poster Updated - "}`;
    updateObj = {
      ...updateObj,
      ...latestMovieDetails,
      posterURL: currentMovieDetails.posterURL || latestMovieDetails.posterURL,
    };
  }

  // Check if savedDate is present, if not, add undefined savedDate
  if (!currentMovieDetails?.savedDate) {
    updateObj = { ...updateObj, savedDate: Date.now() };
  }

  if (updateObj) {
    //Merge with existing item
    state.oSaved.savedTVShows = state.oSaved.savedTVShows.map((movie) => {
      if (movie.id === movieId) {
        return { ...movie, ...updateObj };
      }
      return movie;
    });

    // Store all movies to Async Storage
    const mergeObj = { [movieId]: { ...updateObj } };
    await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

    //Save to firestore
    const updateStmt = { ...updateObj };
    //Save to firestore
    await effects.oSaved.updateMovie(movieId, updateStmt);
  }
  return returnMessage;
};

/**
 * saveTVShow - save the passed TV Show id to state and firestore
 *
 * @param {*} context
 * @param {number} tvShowId
 */
export const saveTVShow = async ({ state, effects, actions }: Context, tvShowId: number) => {
  //! We are tagging the result set so that the search screen will know that the movie
  //! is part of our saved movies.
  //! BUT we do NOT need to save this field in firebase.  We can add it during hydration.

  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;

  // check to see if TV Show exists as a safeguard against duplicates in database
  if (state.oSaved.savedTVShows.some((tvShow) => tvShow.id === tvShowId)) {
    return;
  }
  // get the details from tmdb_api
  const tvShowDetailsTMDB = await effects.oSaved.getTVShowDetails(tvShowId);
  // Make sure date isn't undefined and store only epoch and formatted
  // let epoch = tvShowDetailsTMDB.data?.firstAirDate?.epoch || 0;
  // let formatted = tvShowDetailsTMDB.data?.firstAirDate?.formatted || "";
  // tvShowDetailsTMDB.data.firstAirDate = { epoch, formatted };

  //* Fields NOT from API
  //#  Set a default userRating of 0
  const tvShowRecordToWrite: SavedTVShowsDoc = {
    id: tvShowDetailsTMDB.data.id,
    name: tvShowDetailsTMDB.data.name,
    firstAirDate: formatDateObjectForSave(tvShowDetailsTMDB.data.firstAirDate),
    lastAirDate: formatDateObjectForSave(tvShowDetailsTMDB.data.lastAirDate),
    nextAirDate: formatDateObjectForSave(tvShowDetailsTMDB.data?.nextEpisodeToAir?.airDate),
    posterURL: tvShowDetailsTMDB.data.posterURL,
    genres: tvShowDetailsTMDB.data.genres,
    avgEpisodeRunTime: tvShowDetailsTMDB.data.avgEpisodeRunTime,
    status: tvShowDetailsTMDB.data.status,
    // TV Tracker created items
    userRating: 0,
    savedDate: getCurrentDate(),
  };

  // Store TV Show in overmind state
  state.oSaved.savedTVShows = [tvShowRecordToWrite, ...state.oSaved.savedTVShows];

  // When saving TV Show user is left on search screen, this will update
  // the screen to show that the selected movige has been saved
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

  // Get TV Show genres from savedTVShows objects and update our genres list in state
  state.oSaved.generated.genres = getGenresFromTVShows(state.oSaved.savedTVShows);

  // Store all TV Shows to Async Storage
  await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);

  // Add TV show to firebase
  // await effects.oSaved.addTVShow(tvShowRecordToWrite);
};

export const apiGetTVShowDetails = async (
  { state, effects, actions }: Context,
  tvShowId: number
) => {
  // get more tvShow details from tmdbapi
  const tvShowDetails = await effects.oSaved.getTVShowDetails(tvShowId);
  //! I don't think it matters if this return formats the date objects
  // Make sure date isn't undefined and store only epoch and formatted
  // movieDetails.data.firstAirDate = formatDateObjectForSave(movieDetails.data.firstAirDate);
  // movieDetails.data.lastAirDate = formatDateObjectForSave(movieDetails.data.lastAirDate);

  return tvShowDetails;
};
/**
 *
 * deleteTVShow - delete the passed tvShowId and save to state and firestore
 *
 * @param {*} context
 * @param {string} tvShowId
 */
export const deleteTVShow = async ({ state, effects, actions }: Context, tvShowId: number) => {
  // find and remove TVShow
  state.oSaved.savedTVShows = state.oSaved.savedTVShows.filter(
    (tvShow) => tvShow.id !== tvShowId
  );

  //* Don't need to worry about deleting taggedWith in firestore since they are stored in movie document
  //* However we need to update the local store
  // xtaggedMovies
  // delete state.oSaved.taggedMovies[movieId];
  actions.oSaved.internal.maintainTaggedTVShowObj({ action: "deletetvshow", tvShowId });

  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movie has been saved
  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;
  // state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

  // Cancel any debounced functions
  effects.oSaved.cancelDebounced();

  // Clear any items associated with movie that might be saved in Async storage
  removeFromAsyncStorage(`castdata-${tvShowId}`);

  // Get movie genres from savedTVShows array
  // this makes sure if genre from delete show doesn't exist in other shows it is "removed"
  state.oSaved.generated.genres = getGenresFromTVShows(state.oSaved.savedTVShows);

  // Store all movies to Async Storage
  await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);

  //* Firestore
  // await effects.oSaved.deleteTVShow(tvShowId);
};

/**
 * * updated for New Data Model
 * updateMovieBackdropImage - update the passed movieIds backdrop image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, backdropUrl}
 */
export const updateMovieBackdropImage = async ({ state, effects }, payload) => {
  const { movieId, backdropURL } = payload;
  //update the passed movieId's backdropURL
  state.oSaved.savedTVShows.forEach((movie) => {
    if (movie.id === movieId) {
      return (movie.backdropURL = backdropURL);
    }
  });

  // Store all movies to Async Storage
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [movieId]: { backdropURL: backdropURL } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  //Save to firestore
  // const updateStmt = { backdropURL: backdropURL };
  //Save to firestore
  // await effects.oSaved.updateMovie(movieId, updateStmt);
};
/**
 * * updated for New Data Model
 * updateTVShowPosterImage - update the passed Ids poster image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, posterUrl}
 */
export const updateTVShowPosterImage = async (
  { state, effects }: Context,
  payload: { tvShowId: number; posterURL: string }
) => {
  const { tvShowId, posterURL } = payload;

  // -- COMMENT OUT FIRESTORE
  // check if we are updating a different tvShow.  If so flush
  // This has to do with the debounce we do on updating the posterImage
  // state.oSaved.currentTVShowId = await checkCurrentTVShowId(
  //   state.oSaved.currentTVShowId,
  //   tvShowId,
  //   effects.oSaved.updatePosterURL
  // );

  //update the passed tvShowId's posterURL
  state.oSaved.savedTVShows.forEach((tvShow) => {
    if (tvShow.id === tvShowId) {
      tvShow.posterURL = posterURL;
    }
  });

  //! No longer storing all tvShows on update, using the MergeItem function from AsyncStorage
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [tvShowId]: { posterURL: posterURL } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  // -- COMMENT OUT FIRESTORE
  // const updateStmt = { posterURL: posterURL };
  //Save to firestore
  // await effects.oSaved.updateMovie(movieId, updateStmt); //<---OLD non-debounced call
  //Debounced write to DB
  // effects.oSaved.updatePosterURL(tvShowId, updateStmt);
};

//*================================================================
//* - TAG (tagData) Actions
//*================================================================

//-This function is only run when a person first signs up.
//-It just returns the default tags that a user starts with.
export const initialTagCreation = ({ state, effects }) => {
  let tagArray = [
    { tagId: uuidv4(), tagName: "Favorites" },
    { tagId: uuidv4(), tagName: "Watched" },
    { tagId: uuidv4(), tagName: "Next Up" },
  ];
  return tagArray;
};

//-
export const addNewTag = async ({ state, effects }, tagName) => {
  let existingTags = state.oSaved.tagData;
  // Check to see if tag with same name exists (disregard case)
  if (existingTags.some((tag) => tag.tagName.toLowerCase() === tagName.toLowerCase())) {
    return;
  }
  let tagId = uuidv4();
  let newTag = {
    tagId,
    tagName,
  };

  state.oSaved.tagData.push(newTag);

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // -- COMMENT OUT FIRESTORE
  // Store tags to firestore
  // await effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of TV shows
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const deleteTag = async ({ state, effects, actions }: Context, tagId: string) => {
  let existingTags = state.oSaved.tagData;
  let { taggedTVShows } = state.oSaved;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.filter((tag) => tag.tagId !== tagId);

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);

  // Loop through all taggedMovie records and remove the tag being deleted from
  // any oSaved.taggedTVShows and oSaved.savedTVShows[n].taggedWith
  Object.keys(taggedTVShows).forEach((tvShowIdString) => {
    // Convert to number to satisfy TypeScript (and because tvShowId is a number!)
    const tvShowId = +tvShowIdString;
    // Check each oSaved.taggedTVShows object property to see if it's array includes the tag being deleted.
    if (taggedTVShows[tvShowId].includes(tagId)) {
      // This action will delete the tag from both the oSaved.taggedTVShows and oSaved.savedTVShows[n].taggedWith
      actions.oSaved.removeTagFromTVShow({ tvShowId, tagId });
    }
  });

  //- Remove deleted tag from any saved filters it is in ----
  // Check all saved filters for deleted tag and remove
  state.oSaved.savedFilters = state.oSaved.savedFilters.map((filter) => {
    filter.excludeTags = filter.excludeTags.filter((id) => id !== tagId);
    filter.tags = filter.tags.filter((id) => id !== tagId);
    return filter;
  });
  // Save data to local
  effects.oSaved.localSaveSavedFilters(state.oAdmin.uid, state.oSaved.savedFilters);
  // -- COMMENT OUT FIRESTORE
  // Save to Firebase
  // effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
  //----------------------------

  // Check currently applied filter and remove deleted tag
  state.oSaved.filterData.excludeTags = state.oSaved.filterData.excludeTags.filter(
    (id) => id !== tagId
  );
  state.oSaved.filterData.tags = state.oSaved.filterData.tags.filter((id) => id !== tagId);
};
/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const editTag = async ({ state, effects }, payload) => {
  let { tagId, updatedTag } = payload;
  let existingTags = state.oSaved.tagData;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.map((tag) => {
    if (tag.tagId === tagId) {
      return { ...tag, tagName: updatedTag };
    }
    return tag;
  });

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // -- COMMENT OUT FIRESTORE
  // Store tags to firestore
  // await effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles updating the whole array of oSaved.tagData
 * Need to debounce data save effect so only updates once every 15 seconds.
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const updateTags = async ({ state, effects }, payload) => {
  state.oSaved.tagData = payload;

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // -- COMMENT OUT FIRESTORE
  // Store tags to firestore
  // await effects.oSaved.saveTags([...state.oSaved.tagData]);
};

//*================================================================
//* - TAGGED TVShow  Actions
//*================================================================
//-- Add a tagId to the taggedMovie Object
//-- Also update the taggedWith property on the savedTVShows state.
//-- payload = {tvShowId, tagId }
export const addTagToTVShow = async (
  { state, effects, actions }: Context,
  payload: { tvShowId: number; tagId: string }
) => {
  let taggedTVShows = state.oSaved.taggedTVShows || {};
  const { tvShowId, tagId } = payload;
  // -- COMMENT OUT FIRESTORE
  // check if we are updating a different tv show.  If so flush any debounced calls
  // the effects.oSaved.updateTVShowTags function will only be used to flush (it is a debounced function)
  // state.oSaved.currentTVShowId = await checkCurrentTVShowId(
  //   state.oSaved.currentTVShowId,
  //   tvShowId,
  //   effects.oSaved.updateTVShowTags
  // );

  // if the tvShowId property doesn't exist then no tags have been added, so add as a new array
  actions.oSaved.internal.maintainTaggedTVShowObj({ action: "addtag", tvShowId, tagId });
  // if (!taggedTVShows.hasOwnProperty(tvShowId)) {
  //   taggedTVShows[tvShowId] = [tagId];
  // } else {
  //   taggedTVShows[tvShowId] = [...taggedTVShows[tvShowId], tagId];
  // }

  // Find movie that tag is being added to and update state
  actions.oSaved.internal.updateTaggedWithOnTVShow(tvShowId);

  //! No longer storing all movies to Async Storage on updates using merge option in AsyncStorage module
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [tvShowId]: { taggedWith: [...taggedTVShows[tvShowId]] } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  // -- COMMENT OUT FIRESTORE
  // const updateStmt = { taggedWith: [...taggedTVShows[tvShowId]] };
  // Update movie document in firestore.
  // await effects.oSaved.updateTVShowTags(tvShowId, updateStmt);
};

// -- Remove a tagId to the taggedMovies Object
// -- payload = { movieId, tagId }
export const removeTagFromTVShow = async (
  { state, effects, actions }: Context,
  payload: { tvShowId: number; tagId: string }
) => {
  let taggedTVShows = state.oSaved.taggedTVShows || {};
  const { tvShowId, tagId } = payload;

  // -- COMMENT OUT FIRESTORE
  // check if we are updating a different movie.  If so flush
  // state.oSaved.currentTVShowId = await checkCurrentTVShowId(
  //   state.oSaved.currentTVShowId,
  //   tvShowId,
  //   effects.oSaved.updateTVShowTags
  // );

  // taggedTVShows[movieId] = taggedTVShows[movieId].filter((tag) => tag !== tagId);
  actions.oSaved.internal.maintainTaggedTVShowObj({ action: "deletetag", tvShowId, tagId });

  // Find tvShow that tag is being added to and update state
  actions.oSaved.internal.updateTaggedWithOnTVShow(tvShowId);

  //! No longer storing all tvShows to Async Storage on updates
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [tvShowId]: { taggedWith: [...taggedTVShows[tvShowId]] } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  // -- COMMENT OUT FIRESTORE
  // const updateStmt = { taggedWith: [...taggedTVShows[tvShowId]] };
  // Update movie document in firestore.
  // await effects.oSaved.updateTVShowTags(tvShowId, updateStmt);
};

//*================================================================
//* - userRating TV Show  Actions
//*================================================================
//-- userRatings are defined as a number between 1 and 10.
//-- Their main purpose is to be available to be part of the sort of the tvShows
//-- They will be stored on the movie document as *userRating*

/**
 * updateUserRatingToTVShow - Add the rating the savedTVShows.userRating
 *  in the store, Async Storage.
 *
 */
export const updateUserRatingToTVShow = async (
  { state, effects }: Context,
  payload: { tvShowId: number; userRating: number }
) => {
  const { tvShowId, userRating } = payload;

  // -- COMMENT OUT FIRESTORE
  // check if we are updating a different movie.  If so flush
  // state.oSaved.currentTVShowId = await checkCurrentTVShowId(
  //   state.oSaved.currentTVShowId,
  //   tvShowId,
  //   effects.oSaved.updateTVShowUserRating
  // );

  // Add userRating to tv show
  state.oSaved.savedTVShows = updateUserRatingOnTVShow(
    tvShowId,
    [...state.oSaved.savedTVShows],
    userRating
  );

  const mergeObj = { [tvShowId]: { userRating: userRating } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  // -- COMMENT OUT FIRESTORE
  // const updateStmt = { userRating: userRating };
  // // Update movie document in firestore.
  // await effects.oSaved.updateTVShowUserRating(tvShowId, updateStmt);
};

//*================================================================
//* - FILTER DATA (filterData) Actions
//*================================================================
export const addTagToFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags.push(tagId);
};

export const removeTagFromFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags = filterData.tags.filter((item) => item !== tagId);
};

export const setTagOperator = ({ state }, tagOperator) => {
  state.oSaved.filterData.tagOperator = tagOperator;
};

// --- Exclude tag options ------
export const addExcludeTagToFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.excludeTags.push(tagId);
};

export const removeExcludeTagFromFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.excludeTags = filterData.excludeTags.filter((item) => item !== tagId);
};

export const setExcludeTagOperator = ({ state }, tagOperator) => {
  state.oSaved.filterData.excludeTagOperator = tagOperator;
};

export const clearFilterTags = ({ state }: Context) => {
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.excludeTags = [];
};
export const clearFilterScreen = ({ state }: Context) => {
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.excludeTags = [];
  state.oSaved.filterData.genres = [];
};

//*================================================================
//* GENRE Actions
//*================================================================
export const addGenreToFilter = ({ state }: Context, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres.push(genre);
};

export const removeGenreFromFilter = ({ state }: Context, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres = filterData.genres.filter((item) => item !== genre);
};

export const clearFilterGenres = ({ state }: Context) => {
  state.oSaved.filterData.genres = [];
};

export const setGenreOperator = ({ state }: Context, genreOperator) => {
  state.oSaved.filterData.genreOperator = genreOperator;
};

// Used to search through saved movie list
// debounce
export const setSearchFilter = pipe(
  debounce(300),
  mutate(({ state }: Context, search: string) => {
    state.oSaved.filterData.searchFilter = search.toLowerCase();
  })
);

//*==============================================
//*- SORT Actions
//*==============================================
export const updateDefaultSortItem = ({ state, effects }: Context, payload) => {
  const { id, active, direction } = payload;
  //Update the settings.defaultSort AND currentSort
  const newSortArray = state.oSaved.settings.defaultSort.map((sortItem) => {
    if (sortItem.id === id) {
      return { ...sortItem, active, sortDirection: direction };
    }
    return sortItem;
  });
  state.oSaved.settings.defaultSort = newSortArray;
  state.oSaved.currentSort = newSortArray;

  // Save data to local
  effects.oSaved.localSaveSettings(state.oAdmin.uid, state.oSaved.settings);
  // -- COMMENT OUT FIRESTORE
  // Save to firestore
  // effects.oSaved.saveSettings(state.oSaved.settings);
};

//* update when sort item order is changed
export const updateDefaultSortOrder = ({ state, effects }: Context, newlyIndexedArray) => {
  // Always saved filter array SORTED.
  state.oSaved.settings.defaultSort = _.sortBy(newlyIndexedArray, ["index"]).map(
    (sortItem, index) => ({
      ...sortItem,
      index,
    })
  );
  state.oSaved.currentSort = [...state.oSaved.settings.defaultSort];

  // Save data to local
  effects.oSaved.localSaveSettings(state.oAdmin.uid, state.oSaved.settings);
  // -- COMMENT OUT FIRESTORE
  // Save to firestore
  // effects.oSaved.saveSettings(state.oSaved.settings);
};

//*==============================================
//*- ACTION HELPERS
//*==============================================
/**
 * Takes in an array of TV Show objects and extracts the
 * Genres from each returning a unique list of genres
 * @param {array of Objects} TVShows
 */
const getGenresFromTVShows = (tvShows: SavedTVShowsDoc[]): string[] => {
  let genresSet: Set<string> = new Set();
  tvShows.forEach((tvShow) => {
    tvShow.genres.forEach((genre) => genresSet.add(genre));
  });
  return [...genresSet].sort();
};

function updateUserRatingOnTVShow(
  tvShowId: number,
  tvShowArray: SavedTVShowsDoc[],
  userRating: number
) {
  for (let i = 0; i < tvShowArray.length; i++) {
    if (tvShowArray[i].id === tvShowId) {
      tvShowArray[i] = { ...tvShowArray[i], userRating };
      break;
    }
  }
  return tvShowArray;
}

// async function checkCurrentTVShowId(
//   currentTVShowId: number,
//   newTVShowId: number,
//   debounceToFlush: _.DebouncedFunc<() => Promise<void>>
// ) {
//   // check if we are updating a different movie.  If so flush
//   if (currentTVShowId !== newTVShowId) {
//     await debounceToFlush.flush();
//   }
//   return newTVShowId;
// }

//--
// This function is simply checking that each tvShow object has an ID
// Currently only called from the Hydrate function to help prevent bad
// data from getting through
function validateSavedTVShows(tvShows: SavedTVShowsDoc[]): SavedTVShowsDoc[] {
  return tvShows.filter((show) => show.id);
}
