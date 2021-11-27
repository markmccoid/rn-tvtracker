import _ from "lodash";
import { Context } from "../overmind";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.

/**
 * createTaggedTVShowsObj - the taggedWith property is stored on each movies document
 * it contains all the tags the movies is tagged with this function
 * replaces the oSaved.taggedMovies object with data from the cloud
 * Called from the hydrateStore action
 * @param {array} savedTVShows
 */
export const createTaggedTVShowsObj = ({ state }: Context, savedTVShows) => {
  state.oSaved.taggedTVShows = savedTVShows.reduce((acc, tvShow) => {
    if (tvShow?.taggedWith) {
      return { ...acc, [tvShow.id]: tvShow.taggedWith };
    }
    return acc;
  }, {});
};

/**
 * hydrateEpisodeState - the episodeState property is stored on each tvShows document
 * it contains the episode state of the given tvShows seasons/episodes
 * hydrates the oSaved.tempEpisodeState object with data from the TVShows document
 * Called from the hydrateStore action
 * @param {array} savedTVShows
 */
export const hydrateEpisodeState = ({ state }: Context, savedTVShows) => {
  // Hydrate the tempEpisodeState
  state.oSaved.tempEpisodeState = savedTVShows.reduce((acc, tvShow) => {
    if (tvShow?.episodeState) {
      return { ...acc, [tvShow.id]: tvShow.episodeState };
    }
    return acc;
  }, {});
  // Hydrate the tempDownloadState
  state.oSaved.tempDownloadState = savedTVShows.reduce((acc, tvShow) => {
    if (tvShow?.downloadState) {
      return { ...acc, [tvShow.id]: tvShow.downloadState };
    }
    return acc;
  }, {});
};

//
export const updateTaggedWithOnTVShow = ({ state }: Context, tvShowId: number) => {
  // For some reason tvShowId came over as string, but is stored as number in overmind.
  tvShowId = +tvShowId;

  state.oSaved.savedTVShows.forEach((tvShow) => {
    if (tvShow.id === tvShowId) {
      tvShow.taggedWith = [...state.oSaved.taggedTVShows[tvShowId]];
    }
  });
};
/**updateEpisodeStateOnTVShow
 *
 */
export const updateEpisodeStateOnTVShow = (
  { state }: Context,
  payload: {
    tvShowId: number;
    workingTempStateObject: string;
    workingTVShowStateObject: string;
  }
) => {
  const { tvShowId, workingTVShowStateObject, workingTempStateObject } = payload;

  state.oSaved.savedTVShows.forEach((tvShow) => {
    if (tvShow.id === tvShowId) {
      tvShow[workingTVShowStateObject] = { ...state.oSaved[workingTempStateObject][tvShowId] };
    }
  });
};

export const maintainTaggedTVShowObj = async (
  { state, actions }: Context,
  payload: {
    action: "deletetvshow" | "deletetag" | "addtag";
    tvShowId: number;
    tagId?: string;
  }
) => {
  const { action, tvShowId, tagId } = payload;
  const { taggedTVShows } = state.oSaved;

  switch (action) {
    case "deletetvshow":
      delete taggedTVShows[tvShowId];
      break;
    case "deletetag":
      taggedTVShows[tvShowId] = taggedTVShows[tvShowId].filter((id) => id !== tagId);
      break;
    case "addtag":
      if (!taggedTVShows.hasOwnProperty(tvShowId)) {
        taggedTVShows[tvShowId] = [tagId];
      } else {
        taggedTVShows[tvShowId] = [...taggedTVShows[tvShowId], tagId];
      }
      break;
    default:
      break;
  }
};

export const getSavedMovieDocument = (savedMovies, movieId) => {
  return _.find(savedMovies, ["id", movieId]);
};
