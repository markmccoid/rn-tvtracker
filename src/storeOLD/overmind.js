import { createHook } from "overmind-react";
import * as actions from "./actions";
import * as effects from "./effects";
import { onInitialize } from "./onInitialize";

export const config = {
  onInitialize,
  state: {
    searchResults: {
      newSearch: true,
      currentPage: undefined,
      totalPages: undefined,
      data: []
    },
    savedMovies: []
  },
  actions,
  effects
};

export const useOvermind = createHook();
