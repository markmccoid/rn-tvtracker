import * as actions from "./actions";
import { Datasource } from "../../types";

export type State = {
  username: string;
  email: string;
  uid: string;
  dropboxToken: string;
  isLoggedIn: boolean;
  appState: {
    dataSource: Datasource;
    hydrating: boolean;
    deepLink: string;
  };
};

const state: State = {
  username: "",
  email: "",
  uid: undefined,
  dropboxToken: undefined,
  isLoggedIn: undefined,
  appState: {
    dataSource: undefined,
    hydrating: false,
    deepLink: undefined,
  },
};
export const config = {
  state,
  actions,
};
