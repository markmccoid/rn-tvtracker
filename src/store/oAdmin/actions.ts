import { Context } from "../overmind";

export const logUserIn = (
  { state, effects, actions }: Context,
  user: { username: string; uid: string }
) => {
  state.oAdmin.isLoggedIn = true;
  state.oAdmin.username = user.username;
  state.oAdmin.uid = user.uid;
  actions.oSaved.hydrateStore({ uid: user.uid, forceRefresh: false });
  // Set the allGenres state item
  actions.oSearch.searchSetup();
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
