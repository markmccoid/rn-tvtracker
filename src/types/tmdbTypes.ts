import { SortByOptions } from "@markmccoid/tmdb_api";

export type DateObject = {
  date?: Date;
  epoch: number;
  formatted: string;
};

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
  genres: string[];
};

// This is not use in the main program, but in queryTVAPI() it get this result
// and stores each item separately in state.
export type TVSearchResult = {
  currentPage: number;
  totalPages: number;
  data: TVSearchItem[];
};
