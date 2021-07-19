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
//
export const updateTaggedWithOnTVShow = ({ state }: Context, tvShowId: number) => {
  // For some reason tvShowId came over as string, but is stored as number in overmind.
  tvShowId = +tvShowId;

  state.oSaved.savedTVShows.forEach((tvShow) => {
    if (tvShow.id === tvShowId) {
      tvShow.taggedWith = [...state.oSaved.taggedTVShows[tvShowId]];
    }
  });

  // for (let i = 0; i < state.oSaved.savedTVShows.length; i++) {
  //   if (state.oSaved.savedTVShows[i].id === movieId) {
  //     state.oSaved.savedTVShows[i] = {
  //       ...state.oSaved.savedTVShows[i],
  //       taggedWith: state.oSaved.taggedMovies[movieId],
  //     };
  //     break;
  //   }
  // }
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
