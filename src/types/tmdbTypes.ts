import { SortByOptions } from "@markmccoid/tmdb_api";

import { DateObject } from "./index";

//-- oSearch Types
export type AllGenres = {
  id: number;
  name: string;
};

export type DiscoverCriteriaObj = {
  genres?: string[];
  firstAirDateYear?: number;
  watchProviders?: string[];
  sortBy?: SortByOptions;
};
//-- store oSearch Types -----------------
// The results array of the queryTVAPI()
export type TVSearchItem = {
  id: number;
  name: string;
  firstAirDate: DateObject;
  overview: string;
  backdropURL: string;
  posterURL: string;
  genres: string[];
  existsInSaved?: boolean;
};

// This is not use in the main program, but in queryTVAPI() it get this result
// and stores each item separately in state.
export type TVSearchResult = {
  currentPage: number;
  totalPages: number;
  data: TVSearchItem[];
};
