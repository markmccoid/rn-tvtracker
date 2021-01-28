import Firebase from "../../storage/firebase";

export const logUserIn = ({ state }, user) => {
  state.oAdmin.isLoggedIn = true;
  state.oAdmin.email = user.email;
  state.oAdmin.uid = user.uid;
};

export const logUserOut = async ({ state, effects, actions }) => {
  //Before reset, see if we have any debounced functions to flush
  await effects.oSaved.flushDebounced();
  Firebase.auth().signOut();
  state.oAdmin.isLoggedIn = false;
  state.oAdmin.email = "";
  state.oAdmin.uid = "";
  // When user logs out reset the oSaved state to it's default state
  // Found that could set directly from here, but needed to call action to do it.
  actions.oSaved.resetOSaved();
};
