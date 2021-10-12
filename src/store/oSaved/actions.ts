import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";
import { loadFromAsyncStorage, removeFromAsyncStorage } from "../../storage/asyncStorage";
import * as defaultConstants from "./defaultConstants";
import { Context } from "../overmind";
import { scheduleLocalNotification } from "../../utils/notificationHelpers";

import {
  EpisodeRunTimeGroup,
  SavedTVShowsDoc,
  TempSeasonsData,
  TempSeasonsState,
  WatchedSeasonEpisodes,
} from "./state";
import {
  TVShowDetails as TMDBTVShowDetails,
  DateObject,
  Episode,
  TVShowSeasonDetails,
  TVDetail_Seasons,
} from "@markmccoid/tmdb_api";
import { getCurrentDate, formatDateObjectForSave } from "../../utils/helperFunctions";
import { fromUnixTime, differenceInDays, format } from "date-fns";
import { actions } from "xstate";
import { mapContext } from "xstate/lib/utils";
import { UserBackupObject } from "../../types";

export const internal = internalActions;
// export actions for saved filters.
export * from "./actionsSavedFilters";

//*----
//*TYPES
//*----
export type TVShowDetails = TMDBTVShowDetails & { logoURLS: string[] };

//*================================================================
//* - INITIALIZE (Hydrate Store)
//*================================================================
export const hydrateStore = async (
  { state, actions, effects }: Context,
  { uid, forceRefresh = false }: { uid: string; forceRefresh?: boolean }
) => {
  //Used in View Movies to "know" when loading is complete
  state.oAdmin.appState.hydrating = true;

  let userDocData = await effects.oSaved.initializeStore(uid);

  //! -- When this test goes out, you can remove the checkandupdateschema line and
  //! -- uncomment the below line
  // state.oSaved.savedTVShows = validateSavedTVShows(userDocData.savedTVShows);
  state.oSaved.savedTVShows = await actions.oSaved.checkAndUpdateSchema(
    validateSavedTVShows(userDocData.savedTVShows)
  );

  state.oSaved.tagData = userDocData.tagData;
  state.oSaved.savedFilters = userDocData.savedFilters;
  //Update the datasource (loaded from local or cloud(firestore))
  state.oAdmin.appState.dataSource = userDocData.dataSource;
  // Tag data is stored on the TV shows document.  This function creates the
  // oSaved.taggedTVShows data structure within Overmind
  actions.oSaved.internal.createTaggedTVShowsObj(userDocData.savedTVShows);
  actions.oSaved.internal.hydrateEpisodeState(userDocData.savedTVShows);
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
  }

  // Get movie genres from savedTVShows objects
  state.oSaved.generated.genres = getGenresFromTVShows(state.oSaved.savedTVShows);

  // Apply a default filter, if one has been selected in settings and we are not doing a forced refresh
  const defaultFilterId = state.oSaved.settings?.defaultFilter;
  if (defaultFilterId && !forceRefresh) {
    //Apply default Filter
    actions.oSaved.applySavedFilter(defaultFilterId);
  }

  //! Auto Update TV Shows Implemententation
  // Find shows that need updating and update them
  const showUpdateList = createUpdateList(state.oSaved.savedTVShows);
  // console.log("update list", showUpdateList);
  //
  //map will return array of promises
  let updates = await showUpdateList.map(async (tvShowId) => {
    return await actions.oSaved.refreshTVShow({ tvShowId, isAutoUpdate: true });
  });

  await Promise.all(updates);
  //! END Update Shows
  //! ------------------

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
//* - TV Show (state.savedTVShows) Actions
//*================================================================
/**
 * Refresh TV Show
 * Updates passed tvShowId record in savedTVShows
 * as well as updating the lastUpdateDate
 *
 */
export const refreshTVShow = async (
  { state, effects, actions }: Context,
  { tvShowId, isAutoUpdate = false }: { tvShowId: number; isAutoUpdate?: boolean }
) => {
  // Get the lastest data from the API for the passed tvShowId
  // get more movie details from tmdbapi
  const { data: latesTVShowDetails } = await effects.oSaved.getTVShowDetails(tvShowId);

  state.oSaved.getNotWatchedEpisodeCount(tvShowId);
  //! IMPLEMENTATION
  //! Do not update the posterURL as user could have changed
  //! Create Object with only items that will be updated as to leave
  //! any system and user created data alone
  //removed id, posterURL, userRating, dateSaved,
  const tvShowRecordUpdates = {
    name: latesTVShowDetails.name,
    firstAirDate: formatDateObjectForSave(latesTVShowDetails.firstAirDate),
    lastAirDate: formatDateObjectForSave(latesTVShowDetails.lastAirDate),
    nextAirDate: formatDateObjectForSave(latesTVShowDetails?.nextEpisodeToAir?.airDate),
    genres: latesTVShowDetails.genres,
    avgEpisodeRunTime: latesTVShowDetails.avgEpisodeRunTime,
    episodeRunTimeGroup: groupAvgRunTime(latesTVShowDetails.avgEpisodeRunTime),
    status: latesTVShowDetails.status,
    // TV Tracker created items
    dateLastUpdated: getCurrentDate().epoch,
    totalEpisodes: calcTotalEpisodes(latesTVShowDetails.seasons),
  };

  //* -- Refresh being called automatically because something in createUpdateList() function
  //* -- triggered the auto refresh (usually a new episode dropping)
  if (isAutoUpdate) {
    const currNextAirDate = state.oSaved.getTVShowDetails(tvShowId).nextAirDate?.epoch;
    const newNextAirDate = latesTVShowDetails.nextEpisodeToAir?.airDate?.epoch;
    const today = new Date();
    const compareNextAirDate = new Date(newNextAirDate * 1000);
    today.setHours(0, 0, 0, 0);
    compareNextAirDate.setHours(0, 0, 0, 0);
    // We should only see this condition once when the next air date changes.
    if (newNextAirDate > currNextAirDate) {
      const currentDate = new Date();
      const showName = state.oSaved.getTVShowDetails(tvShowId).name;
      const nextAirDateFormatted = latesTVShowDetails.nextEpisodeToAir?.airDate?.formatted;
      const nextAirDateDOW = format(fromUnixTime(newNextAirDate), "EEEE");
      const notificationData = {
        title: `${showName} New Episode`,
        body: `New Episode of ${showName} on ${nextAirDateDOW}, ${nextAirDateFormatted}`,
        triggerDate: new Date(newNextAirDate * 1000), //Need to mult by 1000 because we are storing epoch seconds
        triggerDate2: new Date(currentDate.setMinutes(currentDate.getMinutes() + 10)),
      };
      //Notification will run on the nextAirDate at 9am
      // ONLY run if current date is LESS THAN the new Next air date
      // You can't run a notification in the past.
      if (today < compareNextAirDate) {
        await scheduleLocalNotification(
          `${notificationData.title} Today!`,
          notificationData.body,
          tvShowId,
          notificationData.triggerDate,
          9
        );
      }
      //! Notification scheduled for 10 minutes after this is run
      //! May not keep this notification
      await scheduleLocalNotification(
        `${notificationData.title} Announced`,
        notificationData.body,
        tvShowId,
        notificationData.triggerDate2
      );
    }
  }
  // Get current saved movie
  const updatedTVShowDetails = {
    ...state.oSaved.getTVShowDetails(tvShowId),
    ...tvShowRecordUpdates,
  };

  state.oSaved.savedTVShows = [
    ...state.oSaved.savedTVShows.filter((tvShow) => tvShowId !== tvShow.id),
    updatedTVShowDetails,
  ];

  // Store all movies to Async Storage
  const mergeObj = { [tvShowId]: { ...updatedTVShowDetails } };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);
  // console.log("UPDATED TV show", mergeObj[tvShowId].name);
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
  const tvShowLogos = await effects.oSaved.getTVShowLogoImages(tvShowId);
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
    episodeRunTimeGroup: groupAvgRunTime(tvShowDetailsTMDB.data.avgEpisodeRunTime),
    status: tvShowDetailsTMDB.data.status,
    // TV Tracker created items
    userRating: 0,
    dateSaved: getCurrentDate().epoch,
    dateLastUpdated: getCurrentDate().epoch,
    totalEpisodes: calcTotalEpisodes(tvShowDetailsTMDB.data.seasons),
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
): Promise<{ data: TVShowDetails; apiCall: string }> => {
  // get more tvShow details from tmdbapi
  const tvShowDetails = await effects.oSaved.getTVShowDetails(tvShowId);
  const tvShowLogoURLs = await effects.oSaved.getTVShowLogoImages(tvShowId);
  //! I don't think it matters if this return formats the date objects
  // Make sure date isn't undefined and store only epoch and formatted
  // movieDetails.data.firstAirDate = formatDateObjectForSave(movieDetails.data.firstAirDate);
  // movieDetails.data.lastAirDate = formatDateObjectForSave(movieDetails.data.lastAirDate);

  return { ...tvShowDetails, data: { ...tvShowDetails.data, logoURLS: tvShowLogoURLs.data } };
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
export const clearFilterScreen = ({ state }: Context): void => {
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

export const setIgnoreFilterOnSearch = ({ state }: Context, ignoreFilterFlag) => {
  state.oSaved.filterData.ignoreFilterOnSearch = ignoreFilterFlag;
};
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
//*- TV SHOW SEASON DATA
//*==============================================
/** getTVShowSeasonData
 * gets season data from tmdb api and stores in
 * tempSeasonsData.
 */
export const getTVShowSeasonData = async (
  { state, effects }: Context,
  { tvShowId, seasonNumbers }: { tvShowId: number; seasonNumbers: number[] }
) => {
  //! If we don't have season data for tvShowId, then query the api and save it
  if (!state.oSaved.tempSeasonsData[tvShowId]) {
    const seasonData = await effects.oSaved.getTVShowSeasonDataAPI(tvShowId, seasonNumbers);
    // Exclude any "special" season (seasonNumber === 0)
    const regularSeasons = seasonData.filter((season) => season.seasonNumber !== 0);
    const specialSeason = seasonData.filter((season) => season.seasonNumber === 0);
    const finalSeasons = [...regularSeasons, ...specialSeason];

    state.oSaved.tempSeasonsData = {
      ...state.oSaved.tempSeasonsData,
      [tvShowId]: finalSeasons, //[...regularSeasons, ...specialSeason],
    };

    //-- Create the seasonStates for use in determining if a
    //-- season should be expanded or collapsed
    const seasonStates: { [seasonNumber: number]: boolean } = finalSeasons.reduce(
      (final, season, index, array) => {
        return { ...final, [season.seasonNumber]: array.length > 1 ? false : true };
      },
      {}
    );
    state.oSaved.tempSeasonsState = {
      ...state.oSaved.tempSeasonsState,
      [tvShowId]: seasonStates,
    };
  }
};

// //-- Toggles whether season should be expanded or not
// export const toggleSeasonState = ({ state }: Context, payload) => {
//   const { tvShowId, seasonNumber } = payload;
//   const tvShowStateObject = state.oSaved.tempSeasonsState[tvShowId];
//   state.oSaved.tempSeasonsState[tvShowId] = {
//     ...state.oSaved.tempSeasonsState[tvShowId],
//     [seasonNumber]: !tvShowStateObject[seasonNumber],
//   };
// };

//*==================================
//- EPISODE STATE
//*==================================
/** toggleTVShowEpisodeState
 *
 */
export const toggleTVShowEpisodeState = async (
  { state, actions, effects }: Context,
  payload: { tvShowId: number; seasonNumber: number; episodeNumber: number }
): Promise<boolean> => {
  const { tvShowId, seasonNumber, episodeNumber } = payload;
  // Since we are assigning true/false directly to tempEpisodeState[tvShowId] we need
  // to make sure it exists first!
  if (!state.oSaved.tempEpisodeState[tvShowId]) {
    state.oSaved.tempEpisodeState = { ...state.oSaved.tempEpisodeState, [tvShowId]: {} };
  }
  const tvShowWatchData = state.oSaved.tempEpisodeState[tvShowId];

  // Needed to know if we are toggling episode to "watched"(true) or "not watched"(false)
  // So that we know if we should ask them to mark all previous episodes as watched.
  let isNextStateWatched = true;

  // Determine if the previous episode is marked as watched.
  // if not, then ask (or just do) if all previous episodes
  // should be marked as watched.
  const previousKey = findPreviousEpisodeKey(
    state.oSaved.tempSeasonsData[tvShowId],
    seasonNumber,
    episodeNumber
  );

  let prevKeyState = true;
  if (previousKey) {
    prevKeyState = !!state.oSaved.tempEpisodeState?.[tvShowId]?.[previousKey];
  }

  // If this exists, then we are removing the "watch flag"
  if (tvShowWatchData?.[`${seasonNumber}-${episodeNumber}`]) {
    // delete tvShowWatchData[`${seasonNumber}-${episodeNumber}`];
    tvShowWatchData[`${seasonNumber}-${episodeNumber}`] = false;
    isNextStateWatched = false;
  } else {
    // didn't exist so marking as watched
    tvShowWatchData[`${seasonNumber}-${episodeNumber}`] = true;
  }

  // Update savedTVShows state array
  actions.oSaved.internal.updateEpisodeStateOnTVShow(tvShowId);

  // --OPTION 3 ---- Store on disk ONLY in savedTVShows (like taggedWith)
  // -- call it episodeState: { [key: string]: boolean }
  // -- still most likely will need to save with false states
  const mergeObj = {
    [tvShowId]: { episodeState: { ...state.oSaved.tempEpisodeState?.[tvShowId] } },
  };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);

  // If previous episode is NOT watched AND next state IS watched, then return true
  // assumes UI will ask if users wants to mark all as watched
  return previousKey && !prevKeyState && isNextStateWatched;
};

/**markAllPreviousEpisodes
 *
 */
export const markAllPreviousEpisodes = async (
  { state, actions, effects }: Context,
  payload: { tvShowId: number; seasonNumber: number; episodeNumber: number }
): Promise<void> => {
  const { tvShowId, seasonNumber, episodeNumber } = payload;
  // Based on season and episode, get an object with the episode to mark as watched
  const mergeEpisodeStateData = buildEpisodesToMarkObj(
    seasonNumber,
    episodeNumber,
    state.oSaved.tempSeasonsData[tvShowId]
  );

  // Merge with tempEpisodeState data
  Object.entries(mergeEpisodeStateData).forEach(
    ([key, value]: [key: string, value: boolean]) => {
      if (!state.oSaved.tempEpisodeState[tvShowId]?.[key]) {
        state.oSaved.tempEpisodeState[tvShowId][key] = value;
      }
    }
  );

  // update the savedTVShow array with any episode state that has changed for this tvShow
  actions.oSaved.internal.updateEpisodeStateOnTVShow(tvShowId);

  // save to async storage
  const mergeObj = {
    [tvShowId]: { episodeState: { ...state.oSaved.tempEpisodeState?.[tvShowId] } },
  };
  await effects.oSaved.localMergeTVShows(state.oAdmin.uid, mergeObj);
};

export const getEpisodeExternalIds = async ({ state, effects }: Context, payload) => {
  const { tvShowId, seasonNumber, episodeNumber } = payload;
  const externalIdData = await effects.oSaved.getEpisodeIMDBURL(
    tvShowId,
    seasonNumber,
    episodeNumber
  );
  return externalIdData;
};

/**
 * Returns the latest season/episode that is marked as watched for the passed tvShowId
 */
export const getLastestEpisodeWatched = ({ state }: Context, tvShowId: number) => {
  // Get the episodeState object for the passed tvShowId
  // will return undefined if either show is not saved yet or no episodes have bee
  // marked as watched.
  const episodeState = state.oSaved.savedTVShows.find(
    (show) => show.id === tvShowId
  )?.episodeState;

  if (!episodeState) return [1, 1];
  return findLastestEpisodeWatched(episodeState);
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

/**
 * Function accepts the season list from a tvshow and
 * returns the Total number of episodes in ALL seasons
 *
 */
const calcTotalEpisodes = (seasonsList: TVDetail_Seasons[]): number => {
  return seasonsList
    .filter((season) => season.seasonNumber !== 0)
    .reduce((total, season) => {
      total += season.episodeCount;
      return total;
    }, 0);
};

/**
 * Function accepts the Episode State from saved Movies { '1-1': true, ... }
 * I will iterate through and return a [season, episode] that
 * corresponds to that last episode marked as watched.
 *
 * @param watchedEpisodesState
 * @returns
 */
function findLastestEpisodeWatched(
  watchedEpisodesState: WatchedSeasonEpisodes
): [number, number] {
  const largest = Object.entries(watchedEpisodesState).reduce(
    (largest, [key, value]) => {
      // If value==false, then not watched, so bail and continue
      if (!value) return largest;
      // Parse out season and episode
      const season = parseInt(key.slice(0, key.indexOf("-")));
      const episode = parseInt(key.slice(key.indexOf("-") + 1));
      // Create special episode value that incorporates seasons so we can check it
      // while taking into account the season
      const episodeToCheck = season * 100 + episode;
      // Since season is baked into episodeToCheck field, we just
      // need to check it
      if (episodeToCheck > largest[2]) {
        largest[0] = season;
        largest[1] = episode;
        largest[2] = episodeToCheck;
      }
      return largest;
    },
    [0, 0, 0]
  );
  // Return [Season, Episode]
  return [largest[0], largest[1]];
}
//*=========================
//- Previous Episode State Marking helpers
//*=========================
/** findPreviousEpisodeKey
 *
 */
function findPreviousEpisodeKey(
  tempSeasonsData: TVShowSeasonDetails[],
  seasonNumber: number,
  episodeNumber: number
) {
  if (seasonNumber === 0) return undefined;
  if (seasonNumber === 1 && episodeNumber === 1) return undefined;

  if (episodeNumber === 1 && seasonNumber !== 1) {
    // Find the number of episodes in the previous season
    const numOfEpisodes = tempSeasonsData.find(
      (season) => season.seasonNumber === seasonNumber - 1
    ).episodes.length;
    return `${seasonNumber - 1}-${numOfEpisodes}`;
  }

  return `${seasonNumber}-${episodeNumber - 1}`;
}

/** recurseSeasonsBackwards
 * return an object that can be merged in with
 * existing watched data
 * {
 *    '1-1': true,
 *    '1-2': true,
 *    ...
 * }
 */
function buildEpisodesToMarkObj(
  startingSeason,
  startingEpisode,
  tempSeasonsData: TVShowSeasonDetails[]
) {
  let watchedObj: { [x: string]: boolean } = {};
  //* Recursive function
  const recurseSeasonsBackwards = (seasonNumber: number, numOfEpisodes: number) => {
    for (let i = 1; i <= numOfEpisodes; i++) {
      watchedObj[`${seasonNumber}-${i}`] = true;
    }
    if (seasonNumber === 1) return watchedObj;
    const nextNumEpisodes = tempSeasonsData.find(
      (season) => season.seasonNumber === seasonNumber - 1
    ).episodes.length;

    return recurseSeasonsBackwards(seasonNumber - 1, nextNumEpisodes);
  };
  //* -----------------
  recurseSeasonsBackwards(startingSeason, startingEpisode);

  return watchedObj;
}

//*=========================
//- savedTVShow validation
//*=========================
// This function is simply checking that each tvShow object has an ID
// Currently only called from the Hydrate function to help prevent bad
// data from getting through
function validateSavedTVShows(tvShows: SavedTVShowsDoc[]): SavedTVShowsDoc[] {
  return tvShows.filter((show) => show.id);
}

export async function checkAndUpdateSchema(
  { state, effects, actions }: Context,
  tvShows: SavedTVShowsDoc[]
): Promise<SavedTVShowsDoc[]> {
  // if one has totalEpisodes key, assume all have and are up to date
  if (tvShows[0]?.totalEpisodes) {
    return tvShows;
  }
  let newShows: SavedTVShowsDoc[] = [];
  for (const tvShow of tvShows) {
    if (!tvShow?.totalEpisodes) {
      const showDets = await actions.oSaved.apiGetTVShowDetails(tvShow.id);
      newShows.push({ ...tvShow, totalEpisodes: calcTotalEpisodes(showDets.data.seasons) });
    } else {
      newShows.push({ ...tvShow });
    }
  }
  return newShows;
}

function groupAvgRunTime(avgEpisodeRunTime: number): EpisodeRunTimeGroup {
  // Creates 4 groups
  // 0 - 0 to 15 minutes
  // 1 - 16 to 30 minutes
  // 2 - 31 to 60 minutes
  // 3 - Over 60 minutes or undefined
  if (avgEpisodeRunTime <= 15) return 0;
  if (avgEpisodeRunTime <= 30) return 1;
  if (avgEpisodeRunTime <= 60) return 2;
  return 3;
}

//*==========================

function createUpdateList(tvShows: SavedTVShowsDoc[]): number[] {
  // Loop through TV Shows and return a list of tvShowId numbers
  // which should be updated
  return tvShows.reduce((tvShowIds: number[], tvShow) => {
    // Is show status canceled or Ended, do NOT update
    if (tvShow.status === "Canceled" || tvShow.status === "Ended") {
      return tvShowIds;
    }
    // create date-fns date objects and helper object
    // REMEMBER, we are looking at the STORED data. So we are checking whether we need
    // to hit the API to get the next interation of data.
    const showDates = {
      nextAirDate: tvShow.nextAirDate?.epoch && fromUnixTime(tvShow.nextAirDate.epoch),
      lastAirDate: tvShow.lastAirDate?.epoch && fromUnixTime(tvShow.lastAirDate.epoch),
      firstAirDate: tvShow.firstAirDate?.epoch && fromUnixTime(tvShow.firstAirDate.epoch),
      lastUpdateDate: tvShow.dateLastUpdated && fromUnixTime(tvShow.dateLastUpdated),
    };
    const dateComparisons = {
      nextAirLessEqualToday: tvShow.nextAirDate?.epoch <= getCurrentDate().epoch,
      // How many days have passed since the last air date
      daysSinceLastAirDate: differenceInDays(new Date(), showDates.lastAirDate),
      daysSinceLastUpdate: differenceInDays(new Date(), showDates.lastUpdateDate) || 0,
    };
    // console.log(
    //   "Compare Dates",
    //   tvShow.name,
    //   tvShow.nextAirDate?.formatted,
    4; //   dateComparisons.nextAirLessEqualToday
    // );
    // nextAirDate exists and is less than or equal to todays date
    // Which means this date has passed an a new next air date should be available
    // unless this was last episode
    if (
      tvShow.nextAirDate &&
      dateComparisons.nextAirLessEqualToday
      //! Not sure if this is causing issues.  It shouldn't be, but can try adding
      //! back in when get notifications set up.
      // && dateComparisons.daysSinceLastUpdate > 1
    ) {
      return [...tvShowIds, tvShow.id];
    }

    // nextAirDate is undefined, but show is not canceled or ended
    // either In Production or planned or Returning Series where we are waiting for next season.
    //--OPTION 1
    // If In Production or Planned, then we can use the dateLastUpdated to determine what to do
    if (tvShow.status !== "Returning Series" && dateComparisons.daysSinceLastUpdate > 7) {
      return [...tvShowIds, tvShow.id];
    }
    //--OPTION 2
    // If Returning Series, check only if it has been 6 months since Last Air Date and been 7 days
    // since lastUpdateDate
    if (
      tvShow.status === "Returning Series" &&
      !showDates.nextAirDate &&
      dateComparisons.daysSinceLastAirDate > 180 &&
      dateComparisons.daysSinceLastUpdate > 7
    ) {
      return [...tvShowIds, tvShow.id];
    }
    // Must return existing array if nothing matches.
    // console.log("Update List", tvShowIds);
    return tvShowIds;
  }, []);
}

//*================================================================
//* - BACKUP and RESTORE
//*================================================================
//-- Generate BACKUP Image
export const generateBackupObject = async (
  { state, actions, effects }: Context,
  payload: void
) => {
  let userBackupObject = await effects.oSaved.createBackupObject(state.oAdmin.uid);
  return userBackupObject;
};

//-- RESTORE Backup Image
export const restoreBackupObject = async (
  { state, actions, effects }: Context,
  payload: UserBackupObject
): Promise<{ success: boolean }> => {
  const userBackupData = payload;
  // Verify backupData is correctly configured
  // just check for two keys
  if (!userBackupData?.savedTVShows || !userBackupData?.settings) {
    return { success: false };
  }
  // Reset overmind store
  // actions.oSaved.resetOSaved();
  actions.oSaved.clearFilterScreen();
  // Restore backup image
  await effects.oSaved.restoreBackupObject(state.oAdmin.uid, userBackupData);
  // Think to manually run hydrate?
  actions.oSaved.hydrateStore({ uid: state.oAdmin.uid });
  return { success: true };
};
