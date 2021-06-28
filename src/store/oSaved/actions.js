import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";
import { removeFromAsyncStorage } from "../../storage/asyncStorage";
import * as defaultConstants from "./defaultContants";

export const internal = internalActions;
// export actions for saved filters.
export * from "./actionsSavedFilters";

//*================================================================
//* - INITIALIZE (Hydrate Store)
//*================================================================
export const hyrdateStore = async (
  { state, actions, effects },
  { uid, forceRefresh = false }
) => {
  //Used in View Movies to "know" when loading is complete
  state.oAdmin.appState.hydrating = true;

  let userDocData = await effects.oSaved.initializeStore(uid, forceRefresh);

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

  //! TEMP adding index to savedFilters if they don't exist
  //! added in version 1.0.9, but should remove once Lori gets her DB updated.
  //! Adding index fields to data we want to be able to drag/drop sort.
  state.oSaved.savedFilters = state.oSaved.savedFilters.map((filter, index) => ({
    index,
    ...filter,
  }));
  state.oSaved.settings.defaultSort = state.oSaved.settings.defaultSort.map(
    (sortItem, index) => ({
      index,
      id: sortItem.sortField,
      ...sortItem,
    })
  );
  //!-- END Updates for new fields --

  // Copy over default sort. This is future proofing, in case we want to let user change current sort on the fly.
  state.oSaved.currentSort = [...state.oSaved.settings?.defaultSort];

  // If the defaultFilter id doesn't exist in the savedFilters array, then delete the default filter.
  if (!state.oSaved.savedFilters.some((el) => el.id === state.oSaved.settings.defaultFilter)) {
    state.oSaved.settings.defaultFilter = null;
    // Save data to local
    await effects.oSaved.localSaveSettings(uid, state.oSaved.settings);
    // Save to firestore
    await effects.oSaved.saveSettings(state.oSaved.settings);
  }

  // Apply a default filter, if one has been selected in settings and we are not doing a forced refresh
  const defaultFilterId = state.oSaved.settings?.defaultFilter;
  if (defaultFilterId && !forceRefresh) {
    //Apply default Filter
    actions.oSaved.applySavedFilter(defaultFilterId);
  }
  // Get movie genres from savedMovies objects
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedTVShows);
  state.oAdmin.appState.hydrating = false;
};

//*================================================================
//* - Reset oSaved on user Logout
//*================================================================
export const resetOSaved = async ({ state, effects, actions }) => {
  state.oSaved.savedTVShows = [];
  state.oSaved.tagData = [];
  state.oSaved.taggedMovies = {};
  state.oSaved.settings = {};
  // state.oSaved.filterData = {};
  actions.oSaved.clearFilterScreen();
  state.oSaved.savedFilters = [];
  state.oSaved.generated.genres = [];
  state.oSaved.settings.defaultSort = defaultConstants.defaultSort;
};

//*================================================================
//* - MOVIE (state.savedMovies) Actions
//*================================================================
/**
 * Refresh Movie
 *  Will update movies data IF title, releaseDate, imdbId or status has changed.
 *  Also checks to see if the savedDate property is on the movie in question (internal field)
 *  If not it will add a savedDate: date.now() to the movie.
 *
 */
export const refreshMovie = async ({ state, effects, actions }, movieId) => {
  // Get the lastest data from the API for the passed movieId
  // get more movie details from tmdbapi
  const { data: latestMovieDetails } = await effects.oSaved.getMovieDetails(movieId);
  // Make sure date isn't undefined and store only epoch and formatted
  let epoch = latestMovieDetails?.releaseDate?.epoch || "";
  let formatted = latestMovieDetails?.releaseDate?.formatted || "";
  latestMovieDetails.releaseDate = { epoch, formatted };

  // Get current saved movie
  const currentMovieDetails = { ...state.oSaved.getMovieDetails(movieId) };

  // We will build updateObj and then update if not undefined
  let updateObj = undefined;
  let returnMessage = "Movie Up To Date\n";

  //These are the field we are checking.
  const fieldsToCheck = {
    titleMatch: latestMovieDetails.title === currentMovieDetails.title,
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
      backdropURL: currentMovieDetails.backdropURL || latestMovieDetails.backdropURL,
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
 * saveMovie - save the passed movie object to state and firestore
 *
 * @param {*} context
 * @param {Object} movieObj
 */
export const saveMovie = async ({ state, effects, actions }, movieObj) => {
  //! We are tagging the result set so that the search screen will know that the movie
  //! is part of our saved movies.
  //! BUT we do NOT need to save this field in firebase.  We can add it during hydration.

  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;

  // check to see if movie exists as a safeguard against duplicates in database
  if (state.oSaved.savedTVShows.some((movie) => movie.id === movieObj.id)) {
    return;
  }
  // get more movie details from tmdbapi
  const movieDetails = await effects.oSaved.getMovieDetails(movieObj.id);
  // Make sure date isn't undefined and store only epoch and formatted
  let epoch = movieDetails.data?.releaseDate?.epoch || "";
  let formatted = movieDetails.data?.releaseDate?.formatted || "";
  movieDetails.data.releaseDate = { epoch, formatted };

  //* Fields NOT from API
  //#  Set a default userRating of 0
  movieDetails.data.userRating = 0;
  movieDetails.data.savedDate = Date.now();

  // Store movie in overmind state
  state.oSaved.savedTVShows = [movieDetails.data, ...state.oSaved.savedTVShows];

  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movige has been saved
  // state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------

  // Get movie genres from savedMovies objects and update our genres list in state
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedTVShows);

  // Store all movies to Async Storage
  await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);

  // Add movie to firebase
  await effects.oSaved.addMovie(movieDetails.data);
};

export const apiGetMovieDetails = async ({ state, effects, actions }, movieId) => {
  // get more movie details from tmdbapi
  const movieDetails = await effects.oSaved.getMovieDetails(movieId);
  // Make sure date isn't undefined and store only epoch and formatted
  let epoch = movieDetails.data?.releaseDate?.epoch || "";
  let formatted = movieDetails.data?.releaseDate?.formatted || "";
  movieDetails.data.releaseDate = { epoch, formatted };
  return movieDetails;
};
/**
 *
 * deleteMovie - delete the passed movieId and save to state and firestore
 *
 * @param {*} context
 * @param {string} movieId
 */
export const deleteMovie = async ({ state, effects, actions }, movieId) => {
  // find and remove movie
  state.oSaved.savedTVShows = state.oSaved.savedTVShows.filter(
    (movie) => movie.id !== movieId
  );

  //* Don't need to worry about deleting taggedWith in firestore since they are stored in movie document
  //* However we need to update the local store
  // xtaggedMovies
  // delete state.oSaved.taggedMovies[movieId];
  actions.oSaved.internal.maintainTaggedMoviesObj({ action: "deletemovie", movieId });

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
  removeFromAsyncStorage(`castdata-${movieId}`);

  // Get movie genres from savedMovies objects
  state.oSaved.generated.genres = getGenresFromMovies(state.oSaved.savedTVShows);

  // Store all movies to Async Storage
  await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);

  //* Modified for new Data Model
  await effects.oSaved.deleteMovie(movieId);
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
  const updateStmt = { backdropURL: backdropURL };
  //Save to firestore
  await effects.oSaved.updateMovie(movieId, updateStmt);
};
/**
 * * updated for New Data Model
 * updateMoviePosterImage - update the passed movieIds poster image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, posterUrl}
 */
export const updateMoviePosterImage = async ({ state, effects }, payload) => {
  const { movieId, posterURL } = payload;

  // check if we are updating a different movie.  If so flush
  // This has to do with the debounce we do on updating the posterImage
  state.oSaved.currentMovieId = await checkCurrentMovieId(
    state.oSaved.currentMovieId,
    movieId,
    effects.oSaved.updatePosterURL
  );

  //update the passed movieId's posterURL
  state.oSaved.savedTVShows.forEach((movie) => {
    if (movie.id === movieId) {
      movie.posterURL = posterURL;
    }
  });

  //! No longer storing all movies on update, using the MergeItem function from AsyncStorage
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [movieId]: { posterURL: posterURL } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  const updateStmt = { posterURL: posterURL };
  //Save to firestore
  // await effects.oSaved.updateMovie(movieId, updateStmt); //<---OLD non-debounced call
  //Debounced write to DB
  effects.oSaved.updatePosterURL(movieId, updateStmt);
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
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const deleteTag = async ({ state, effects, actions }, tagId) => {
  let existingTags = state.oSaved.tagData;
  let { taggedMovies } = state.oSaved;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.filter((tag) => tag.tagId !== tagId);

  // Store tags to Async Storage
  await effects.oSaved.localSaveTags(state.oAdmin.uid, state.oSaved.tagData);
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);

  // Loop through all taggedMovie records and remove the tag being deleted from
  // any oSaved.taggedMovies and oSaved.savedMovies[n].taggedWith
  Object.keys(taggedMovies).forEach((movieId) => {
    // Check each oSaved.taggedMovies object property to see if it's array includes the tag being deleted.
    if (taggedMovies[movieId].includes(tagId)) {
      // This action will delete the tag from both the oSaved.taggedMovies and oSaved.savedMovies[n].taggedWith
      actions.oSaved.removeTagFromMovie({ movieId, tagId });
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
  // Save to Firebase
  effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
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
  // Store tags to firestore
  await effects.oSaved.saveTags(state.oSaved.tagData);
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
  // Store tags to firestore
  await effects.oSaved.saveTags([...state.oSaved.tagData]);
};

//*================================================================
//* - TAGGED MOVIES  Actions
//*================================================================
//-- Add a tagId to the taggedMovie Object
//-- Also update the taggedWith property on the savedMovies state.
//-- payload = { movieId, tagId }
export const addTagToMovie = async ({ state, effects, actions }, payload) => {
  let taggedMovies = state.oSaved.taggedMovies || {};
  const { movieId, tagId } = payload;

  // check if we are updating a different movie.  If so flush any debounced calls
  state.oSaved.currentMovieId = await checkCurrentMovieId(
    state.oSaved.currentMovieId,
    movieId,
    effects.oSaved.updateMovieTags
  );

  // if the movieId property doesn't exist then no tags have been added, so add as a new array
  actions.oSaved.internal.maintainTaggedMoviesObj({ action: "addtag", movieId, tagId });
  // if (!taggedMovies.hasOwnProperty(movieId)) {
  //   taggedMovies[movieId] = [tagId];
  // } else {
  //   taggedMovies[movieId] = [...taggedMovies[movieId], tagId];
  // }

  // Find movie that tag is being added to and update state
  actions.oSaved.internal.updateTaggedWithOnMovie(movieId);

  //! No longer storing all movies to Async Storage on updates using merge option in AsyncStorage module
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [movieId]: { taggedWith: [...taggedMovies[movieId]] } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  const updateStmt = { taggedWith: [...taggedMovies[movieId]] };
  // Update movie document in firestore.
  await effects.oSaved.updateMovieTags(movieId, updateStmt);
};

// -- Remove a tagId to the taggedMovies Object
// -- payload = { movieId, tagId }
export const removeTagFromMovie = async ({ state, effects, actions }, payload) => {
  let taggedMovies = state.oSaved.taggedMovies || {};
  const { movieId, tagId } = payload;

  // check if we are updating a different movie.  If so flush
  state.oSaved.currentMovieId = await checkCurrentMovieId(
    state.oSaved.currentMovieId,
    movieId,
    effects.oSaved.updateMovieTags
  );

  // taggedMovies[movieId] = taggedMovies[movieId].filter((tag) => tag !== tagId);
  actions.oSaved.internal.maintainTaggedMoviesObj({ action: "deletetag", movieId, tagId });

  // Find movie that tag is being added to and update state
  actions.oSaved.internal.updateTaggedWithOnMovie(movieId);

  // state.oSaved.savedTVShows = updateTaggedWithOnMovie(
  //   movieId,
  //   [...state.oSaved.savedTVShows],
  //   [...state.oSaved.taggedMovies[movieId] || {}]
  // );

  //! No longer storing all movies to Async Storage on updates
  // await effects.oSaved.localSaveTVShows(state.oAdmin.uid, state.oSaved.savedTVShows);
  const mergeObj = { [movieId]: { taggedWith: [...taggedMovies[movieId]] } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  const updateStmt = { taggedWith: [...taggedMovies[movieId]] };
  // Update movie document in firestore.
  await effects.oSaved.updateMovieTags(movieId, updateStmt);
};

//*================================================================
//* - userRating MOVIES  Actions
//*================================================================
//-- userRatings are defined as a number between 1 and 10.
//-- Their main purpose is to be available to be part of the sort of the movies
//-- They will be stored on the movie document as *userRating*

/**
 * addUserRatingToMovie - Add the rating the savedMovies.userRating
 *  in the store, Async Storage and Firebase.
 *
 */
export const updateUserRatingToMovie = async ({ state, effects }, payload) => {
  const { movieId, userRating } = payload;

  // check if we are updating a different movie.  If so flush
  state.oSaved.currentMovieId = await checkCurrentMovieId(
    state.oSaved.currentMovieId,
    movieId,
    effects.oSaved.updateMovieUserRating
  );

  // Add userRating to movie
  state.oSaved.savedTVShows = updateUserRatingOnMovie(
    movieId,
    [...state.oSaved.savedTVShows],
    userRating
  );

  const mergeObj = { [movieId]: { userRating: userRating } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  const updateStmt = { userRating: userRating };
  // Update movie document in firestore.
  await effects.oSaved.updateMovieUserRating(movieId, updateStmt);
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

export const clearFilterTags = ({ state }) => {
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.excludeTags = [];
};
export const clearFilterScreen = ({ state }) => {
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.excludeTags = [];
  state.oSaved.filterData.genres = [];
};

//*================================================================
//* GENRE Actions
//*================================================================
export const addGenreToFilter = ({ state }, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres.push(genre);
};

export const removeGenreFromFilter = ({ state }, genre) => {
  let filterData = state.oSaved.filterData;
  filterData.genres = filterData.genres.filter((item) => item !== genre);
};

export const clearFilterGenres = ({ state }) => {
  state.oSaved.filterData.genres = [];
};

export const setGenreOperator = ({ state }, genreOperator) => {
  state.oSaved.filterData.genreOperator = genreOperator;
};

// Used to search through saved movie list
// debounce
export const setSearchFilter = pipe(
  debounce(300),
  mutate(({ state }, search) => {
    state.oSaved.filterData.searchFilter = search.toLowerCase();
  })
);

//*==============================================
//*- SORT Actions
//*==============================================
export const updateDefaultSortItem = ({ state, effects }, payload) => {
  const { title, active, direction } = payload;
  //Update the settings.defaultSort AND currentSort
  const newSortArray = state.oSaved.settings.defaultSort.map((sortItem) => {
    if (sortItem.title === title) {
      return { ...sortItem, active, sortDirection: direction };
    }
    return sortItem;
  });
  state.oSaved.settings.defaultSort = newSortArray;
  state.oSaved.currentSort = newSortArray;

  // Save data to local
  effects.oSaved.localSaveSettings(state.oAdmin.uid, state.oSaved.settings);
  // Save to firestore
  effects.oSaved.saveSettings(state.oSaved.settings);
};

//* update when sort item order is changed
export const updateDefaultSortOrder = ({ state, effects }, newlyIndexedArray) => {
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
  // Save to firestore
  effects.oSaved.saveSettings(state.oSaved.settings);
};

//*==============================================
//*- ACTION HELPERS
//*==============================================
/**
 * Takes in an array of Movie objects and extracts the
 * Genres from each returning a unique list of genres
 * @param {array of Objects} movies
 */
const getGenresFromMovies = (movies) => {
  let genresSet = new Set();
  movies.forEach((movie) => {
    movie.genres.forEach((genre) => genresSet.add(genre));
  });
  return [...genresSet].sort();
};

// function updateTaggedWithOnMovie(movieId, movieArray, taggedWithArray) {
//   for (let i = 0; i < movieArray.length; i++) {
//     if (movieArray[i].id === movieId) {
//       movieArray[i] = { ...movieArray[i], taggedWith: taggedWithArray };
//       break;
//     }
//   }
//   return movieArray;
// }

function updateUserRatingOnMovie(movieId, movieArray, userRating) {
  for (let i = 0; i < movieArray.length; i++) {
    if (movieArray[i].id === movieId) {
      movieArray[i] = { ...movieArray[i], userRating };
      break;
    }
  }
  return movieArray;
}

async function checkCurrentMovieId(currentMovieId, newMovieId, debounceToFlush) {
  // check if we are updating a different movie.  If so flush
  if (currentMovieId !== newMovieId) {
    await debounceToFlush.flush();
  }
  return newMovieId;
}
