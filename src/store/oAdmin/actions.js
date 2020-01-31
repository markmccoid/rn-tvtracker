export const logUserIn = ({ state }, user) => {
  state.oAdmin.isLoggedIn = true;
  state.oAdmin.email = user.email;
  state.oAdmin.uid = user.uid;
};

export const logUserOut = ({ state }) => {
  state.oAdmin.isLoggedIn = false;
  state.oAdmin.email = "";
  state.oAdmin.uid = "";
};
