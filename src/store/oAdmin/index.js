import * as actions from './actions';

export const config = {
  state: {
    username: '',
    email: '',
    uid: undefined,
    isLoggedIn: undefined,
    appState: {
      movieEditingId: undefined,
    },
  },
  actions,
};
