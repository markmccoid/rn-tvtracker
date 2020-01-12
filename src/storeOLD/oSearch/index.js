import * as actions from "./actions";

export const config = {
  state: {
    searchQuery: "",
    searchResults: {
      data: [],
      currentPage: undefined,
      totalPages: undefined,
      isNewSearch: true
    }
  },
  actions
};
