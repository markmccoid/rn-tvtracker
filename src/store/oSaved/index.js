import * as actions from "./actions";
import * as effects from "./effects";
import { onInitialize } from "./onInitialize";

export const config = {
  onInitialize,
  state: {
    savedMovies: [],
    tagData: []
  },
  actions,
  effects
};
