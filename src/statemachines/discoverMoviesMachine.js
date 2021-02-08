import { Machine, assign } from "xstate";

//Predefined enum
export const predefinedTypesEnum = {
  POPULAR: "Popular",
  NOWPLAYING: "Now Playing",
  UPCOMING: "Upcoming",
};
export const discoverTypesEnum = {
  TITLE: "Title",
  ADVANCED: "Advanced",
  ...predefinedTypesEnum,
};

// State Functions
const updatePredefined = assign({
  queryType: "predefined",
  predefinedType: (context, event) => event.predefinedType || predefinedTypesEnum.POPULAR,
});
const updateTitle = assign({
  searchString: (context, event) => event.value,
});
const resetContext = assign({
  searchString: "",
  genres: [],
});
const logFunction = (context, event) => console.log("EVENT", event);
const updateDiscoverQuery = assign((context, event) => {
  console.log("update dq", context, event);

  return {
    ...context,
    discoverQuery: {
      queryType: "title",
      config: {
        searchString: context.title,
      },
    },
  };
});

const predefinedStates = {
  POPULAR_SEARCH: {
    target: discoverTypesEnum.POPULAR,
  },
  UPCOMING_SEARCH: {
    target: discoverTypesEnum.UPCOMING,
  },
  NOWPLAYING_SEARCH: {
    target: discoverTypesEnum.NOWPLAYING,
  },
};

// Discover movie search state machine
// States for Title search, Predefined Search and Advanced Search
export const discoverMoviesMachine = Machine(
  {
    id: "discoverMachine",
    initial: "predefined",
    context: {
      searchString: "",
      genres: [],
      queryType: "predefined",
      predefinedType: discoverTypesEnum.POPULAR,
    },
    states: {
      predefined: {
        entry: [logFunction, resetContext, updatePredefined],
        on: {
          UPDATE_PREDEFINED: {
            actions: [updatePredefined],
          },
          TITLE_SEARCH: {
            target: "title",
          },
          ADVANCED_SEARCH: "advanced",
        },
      },
      title: {
        entry: [resetContext, logFunction],
        on: {
          UPDATE_TITLE: {
            actions: [updateTitle],
          },
          ADVANCED_SEARCH: {
            target: "advanced",
          },
          PREDEFINED_SEARCH: {
            target: "predefined",
          },
        },
      },
      advanced: {
        entry: resetContext,
        on: {
          UPDATE_ADV: {
            actions: ["updateadvanced"],
          },
          TITLE_SEARCH: {
            target: "title",
            actions: ["changesearchtype"],
          },
          PREDEFINED_SEARCH: {
            target: "predefined",
          },
        },
      },
    },
  },
  {
    actions: {
      updateadvanced: (context, event) => console.log("updating predefined", event.name),
      changesearchtype: (context, event) => console.log("changing search type", event),
    },
  }
);
