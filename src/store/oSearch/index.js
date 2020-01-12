import * as actions from "./actions";
import * as effects from "./effects";

export const config = {
  state: {
    searchString: "",
    isNewQuery: true,
    resultData: [],
    resultCurrentPage: undefined,
    resultTotalPages: undefined,
    resultIsLoading: false,
    get isMoreData() {
      if (!this.resultCurrentPage || !this.resultTotalPages) {
        return false;
      }
      if (this.resultTotalPages - this.resultCurrentPage > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  actions,
  effects
};
