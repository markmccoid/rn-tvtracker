import * as actions from "./actions";
import { Datasource } from "../../types";

export type State = {
  username: string;
  email: string;
  uid: string;
  isLoggedIn: boolean;
  appState: {
    dataSource: Datasource;
  };
};

const state: State = {
  username: "",
  email: "",
  uid: undefined,
  isLoggedIn: undefined,
  appState: {
    dataSource: undefined,
  },
};
export const config = {
  state,
  actions,
};
