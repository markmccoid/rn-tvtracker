import * as actions from "./actions";
import * as effects from "./effects";

export const config = {
  state: {
    searchString: "",
    isNewQuery: true,
    resultData: [],
    resultCurrentPage: undefined,
    resultTotalPages: undefined,
    isLoading: false,
    queryType: "popular",
    allGenres: [], // [ { id, name }, ...]
    discoverSortBy: "popularity.desc",
  },
  actions,
  effects,
};
