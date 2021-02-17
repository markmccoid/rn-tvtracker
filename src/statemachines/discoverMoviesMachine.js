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
  predefinedType: (context, event) => event.predefinedType || predefinedTypesEnum.POPULAR,
});
const updateTitle = assign({
  searchString: (context, event) => event.value,
});

const resetContext = assign({
  searchString: "",
  genres: [],
  releaseYear: undefined,
  watchProviders: [],
});

const logFunction = (context, event) => console.log("EVENT", event);

// Discover movie search state machine
// States for Title search, Predefined Search and Advanced Search
export const discoverMoviesMachine = Machine({
  id: "discoverMachine",
  initial: "predefined",
  context: {
    searchString: "",
    genres: [],
    releaseYear: undefined,
    watchProviders: [],
    predefinedType: discoverTypesEnum.POPULAR,
  },
  states: {
    predefined: {
      entry: [resetContext],
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
      entry: resetContext,
      on: {
        UPDATE_TITLE: [
          {
            target: "predefined",
            cond: (_, event) => event.value === "",
          },
          {
            actions: updateTitle,
          },
        ],
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
        ADD_GENRE: {
          actions: assign({
            genres: (context, event) => [...context.genres, event.genreId],
          }),
        },
        REMOVE_GENRE: {
          actions: assign({
            genres: (context, event) =>
              context.genres.filter((genreId) => event.genreId !== genreId),
          }),
        },
        CLEAR_GENRES: {
          actions: assign({ genres: [] }),
        },
        UPDATE_RELEASEYEAR: {
          actions: assign({ releaseYear: (context, event) => event.releaseYear }),
        },
        UPDATE_WATCHPROVIDERS: {
          actions: assign({ watchProviders: (context, event) => event.watchProviders }),
        },
        TITLE_SEARCH: {
          target: "title",
        },
        PREDEFINED_SEARCH: {
          target: "predefined",
        },
      },
    },
  },
});
