import { Machine, assign, send } from "xstate";
import { watchProviders } from "../storage/externalData";
import { overmind } from "../store/overmind";

//Predefined enum
export const predefinedTypesEnum = {
  POPULAR: "Popular",
};
export const discoverTypesEnum = {
  TITLE: "Title",
  ADVANCED: "Advanced",
  ...predefinedTypesEnum,
};

// State Functions
const updatePredefined = assign({
  predefinedType: (context, event) => event.predefinedType || predefinedTypesEnum.POPULAR,
});
const updateSearchString = assign({ searchString: (_, event) => event.value });

//---------------
// RESET Functions
//---------------
const resetContext = (queryType) =>
  assign({
    queryType,
    searchString: "",
    genres: [],
    releaseYear: undefined,
    watchProviders: [],
  });

const resetPredefined = assign({
  predefinedType: (_, event) => event.predefinedType || discoverTypesEnum.POPULAR,
});

//---------------
//  PERFORM Search
//---------------
const performAdvancedSearch = (context, event) => {
  const { genres, releaseYear, watchProviders, queryType } = context;
  if (genres.length > 0 || releaseYear || watchProviders.length > 0) {
    overmind.actions.oSearch.queryTVAPIWithConfig({
      queryType,
      genres,
      releaseYear,
      watchProviders,
    });
  }
};
const performSimpleSearch = (context, event) => {
  const { searchString, queryType, predefinedType } = context;
  if (searchString.length > 0 || queryType === "predefined") {
    overmind.actions.oSearch.queryTVAPIWithConfig({
      queryType,
      searchString,
      predefinedType,
    });
  }
};

// Discover movie search state machine
// States for Title search, Predefined Search and Advanced Search
export const discoverTVMachine = Machine({
  id: "discoverMachine",
  initial: "simple",
  context: {
    searchString: "",
    genres: [],
    releaseYear: undefined,
    watchProviders: [],
    predefinedType: discoverTypesEnum.POPULAR,
  },
  states: {
    simple: {
      initial: "predefined",
      on: {
        ADVANCED_SEARCH: "advanced",
        PERFORM_SEARCH: { actions: performSimpleSearch },
      },
      states: {
        predefined: {
          entry: [resetContext("predefined"), resetPredefined, send("PERFORM_SEARCH")],
          on: {
            UPDATE_TITLE: {
              target: "title",
            },
            UPDATE_PREDEFINED: {
              actions: [
                assign({
                  predefinedType: (_, event) => event.predefinedType,
                }),
                send("PERFORM_SEARCH"),
              ],
            },
          },
        },
        title: {
          // resetContextType and set initial searchString value
          // if we move perform search here, then if want to search with only one char, call perform search
          entry: [resetContext("title"), updateSearchString, send("PERFORM_SEARCH")],
          on: {
            UPDATE_TITLE: [
              {
                // got to predefined if user has cleared input box
                target: "predefined",
                cond: (context, event) => event.value === "",
              },
              {
                actions: [updateSearchString, send("PERFORM_SEARCH")],
              },
            ],
            UPDATE_PREDEFINED: {
              target: "predefined",
            },
          },
        },
      },
    },
    advanced: {
      entry: [resetContext("advanced")],
      on: {
        SIMPLE_SEARCH: { target: "simple" },
        UPDATE_GENRES: {
          actions: [
            assign({
              genres: (context, event) => event.genres,
            }),
            send("PERFORM_SEARCH"),
          ],
        },
        UPDATE_RELEASEYEAR: {
          actions: [
            assign({ releaseYear: (context, event) => event.releaseYear }),
            send("PERFORM_SEARCH"),
          ],
        },
        UPDATE_WATCHPROVIDERS: {
          actions: [
            assign({ watchProviders: (context, event) => event.watchProviders }),
            send("PERFORM_SEARCH"),
          ],
        },
        PERFORM_SEARCH: {
          actions: performAdvancedSearch,
        },
      },
    },
  },
});
