import { mapContext } from "xstate/lib/utils";
import { Context } from "../overmind";
import {
  saveDropboxTokenToStorage,
  loadDropboxTokenFromStorage,
} from "../../storage/localData";

export const logUserIn = async (
  { state, effects, actions }: Context,
  user: { username: string; uid: string }
) => {
  state.oAdmin.isLoggedIn = true;
  state.oAdmin.username = user.username;
  state.oAdmin.uid = user.uid;
  actions.oSearch.searchSetup();
  await actions.oSaved.hydrateStore({ uid: user.uid, forceRefresh: false });
  state.oAdmin.dropboxToken = await loadDropboxTokenFromStorage(state.oAdmin.uid);
  // Set the allGenres state item
};

export const logUserOut = async ({ state, effects, actions }: Context) => {
  //Before reset, see if we have any debounced functions to flush
  // await effects.oSaved.flushDebounced();
  state.oAdmin.isLoggedIn = false;
  state.oAdmin.username = "";
  state.oAdmin.uid = "";
  // When user logs out reset the oSaved state to it's default state
  // Found that could set directly from here, but needed to call action to do it.
  actions.oSaved.resetOSaved();
};

export const setDeepLink = ({ state, effects, actions }: Context, deepLink) => {
  state.oAdmin.appState.deepLink = deepLink;
};

//-- stores a dropbox bearer token which allows access to the App/TV_Tracker folder.
//-- store backups, exports, etc.
export const setDropboxToken = async ({ state, effects, actions }: Context, dropboxToken) => {
  state.oAdmin.dropboxToken = dropboxToken;
  await saveDropboxTokenToStorage(state.oAdmin.uid, dropboxToken);
};
