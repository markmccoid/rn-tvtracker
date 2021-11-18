import {
  isDataStale,
  refreshLocalData,
  loadLocalData,
  saveTVShowsToLocal,
  saveTagsToLocal,
  saveSettingsToLocal,
  mergeTVShowsToLocal,
  saveSavedFiltersToLocal,
  saveEpisodeStateToLocal,
  mergeEpisodeStateToLocal,
  createBackupData,
} from "../../storage/localData";

import { loadFromAsyncStorage } from "../../storage/asyncStorage";

import { UserBackupObject, UserDocument } from "../../types";

import _ from "lodash";
import {
  tvGetShowDetails,
  TVShowDetailsBase,
  tvGetShowSeasonDetails,
  tvGetImages,
  tvGetShowEpisodeExternalIds,
  TVShowSeasonDetails,
  tvGetShowEpisodeDetails,
  TVShowEpisodeDetailsBase,
} from "@markmccoid/tmdb_api";

import { SavedTVShowsDoc } from "./state";

/**
 * initializeStore -
 *  returns a dataObj that actions.oState.hydrateStore can use to initialize the store
 *
 * @param {string} uid - uid of user who is logged in
 */
export const initializeStore = async (uid: string) => {
  const dataObj: UserDocument = await loadLocalData(uid);
  return dataObj;
};

/**
 * createBackupObject - returns an object that can be stored and then
 *  read in at a later time to restore the data..
 *
 * @param {string} uid - uid of user who is logged in
 */
export const createBackupObject = async (uid: string) => {
  const backupObj: UserBackupObject = await createBackupData(uid);
  return backupObj;
};

export const restoreBackupObject = async (uid: string, backupObj: UserBackupObject) => {
  //Restore each piece of data to the users local files
  // THIS IS DESTRUCTIVE!!!
  localSaveTVShows(uid, backupObj.savedTVShows);
  localSaveEpisodeState(uid, backupObj.tempEpisodeState);
  localSaveTags(uid, backupObj.tagData);
  localSaveSavedFilters(uid, backupObj.savedFilters);
  localSaveSettings(uid, backupObj.settings);
};

//*=================================
//*- LOCAL storage functions
//*=================================
export const localSaveTVShows = async (uid, savedTVShows) => {
  return saveTVShowsToLocal(uid, savedTVShows);
};
export const localMergeTVShows = async (uid, tvShowObj) => {
  return mergeTVShowsToLocal(uid, tvShowObj);
};
export const localSaveEpisodeState = async (uid, tempEpisodeState) => {
  return saveEpisodeStateToLocal(uid, tempEpisodeState);
};
export const localMergeEpisodeState = async (uid, EpisodeStateMergeObj) => {
  return mergeEpisodeStateToLocal(uid, EpisodeStateMergeObj);
};
export const localSaveTags = async (uid, tags) => {
  return saveTagsToLocal(uid, tags);
};
export const localSaveSettings = async (uid, settings) => {
  return saveSettingsToLocal(uid, settings);
};
export const localSaveSavedFilters = async (uid, settings) => {
  return saveSavedFiltersToLocal(uid, settings);
};

//*=================================
//*- Get TV Show Details from TMDB Api
//*=================================
export const getTVShowDetails = async (tvShowId: number): Promise<TVShowDetailsBase> => {
  let results;

  try {
    results = await tvGetShowDetails(tvShowId);
  } catch (err) {
    return { data: { error: err.error } };
  }
  return results;
  return {
    data: { ...results.data },
    apiCall: results.apiCall,
  };
};
//*=================================
//*- Get TV Show Episode from TMDB Api
//*=================================
export const getTVShowEpisodeDetails = async (
  tvShowId: number,
  seasonNumber: number,
  episodeNumber: number,
  appendParam?: "credits"
): Promise<TVShowEpisodeDetailsBase> => {
  let results;

  try {
    results = await tvGetShowEpisodeDetails(
      tvShowId,
      seasonNumber,
      episodeNumber,
      appendParam
    );
  } catch (err) {
    return { data: { error: err.error } };
  }
  return results;
  return {
    data: { ...results.data },
    apiCall: results.apiCall,
  };
};

//*=================================
//*- Get Episode IMDB URL from TMDB Api
//*=================================
export const getEpisodeIMDBURL = async (
  tvShowId: number,
  seasonNumber: number,
  episodeNumber: number
) => {
  const results = await tvGetShowEpisodeExternalIds(tvShowId, seasonNumber, episodeNumber);

  return results.data;
};
//*=================================
//*- Get TV Show Season Details from TMDB Api
//*=================================
export const getTVShowSeasonDataAPI = async (tvShowId: number, seasonNumbers: number[]) => {
  const seasonData = await Promise.all(
    seasonNumbers.map(async (season) => {
      // Need to pull off just the data piece.
      return tvGetShowSeasonDetails(tvShowId, season).then((resp) => resp.data);
    })
  );
  return seasonData;
};

//*=================================
//*- Get TV Show Season Logos (header images)
//*=================================
export const getTVShowLogoImages = async (tvShowId: number) => {
  return await tvGetImages(tvShowId, "logos");
};
