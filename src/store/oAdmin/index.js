import * as actions from "./actions";

export const config = {
  state: {
    username: "",
    email: "",
    uid: undefined,
    isLoggedIn: false,
    appState: {
      movieEditingId: undefined,
    },
  },
  actions,
};
