import * as actions from "./actions";
import { Datasource } from "../../types";

export type State = {
  username: string;
  email: string;
  uid: string;
  isLoggedIn: boolean;
  appState: {
    dataSource: Datasource;
    hydrating: boolean;
  };
};

const state: State = {
  username: "",
  email: "",
  uid: undefined,
  isLoggedIn: undefined,
  appState: {
    dataSource: undefined,
    hydrating: false,
  },
};
export const config = {
  state,
  actions,
};
