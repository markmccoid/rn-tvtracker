import _ from "lodash";
import uuidv4 from "uuid/v4";
import { pipe, debounce, mutate, filter } from "overmind";
import * as internalActions from "./internalActions";
import { removeFromAsyncStorage } from "../../storage/asyncStorage";
import { Context } from "../overmind";
import {
  TVShowDetails as TMDBTVShowDetails,
  DateObject,
  Episode,
  TVShowSeasonDetails,
} from "@markmccoid/tmdb_api";
import { getCurrentDate, formatDateObjectForSave } from "../../utils/helperFunctions";
import { fromUnixTime, differenceInDays, parseISO } from "date-fns";

export const internal = internalActions;
// export actions for saved filters.

//*----
//*TYPES
//*----
export type TVShowDetails = TMDBTVShowDetails & { logoURLS: string[] };

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
  state.oSaved.tempEpisodeState = userDocData.tempEpisodeState;
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

  //! TEST Implemententation
  // Find shows that need updating and update them
  const showUpdateList = createUpdateList(state.oSaved.savedTVShows);
  // console.log("update list", showUpdateList);
  //
  //map will return array of promises
  let updates = await showUpdateList.map(async (tvShowId) => {
    return await actions.oSaved.refreshTVShow(tvShowId);
  });

  await Promise.all(updates);
  //! END Update Shows
  //! ------------------

  state.oAdmin.appState.hydrating = false;
};

//*================================================================
