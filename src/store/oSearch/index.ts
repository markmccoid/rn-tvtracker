import * as actions from "./actions";
import * as effects from "./effects";
import { TVSearchItem, AllGenres } from "../../types";
import { SortByOptions } from "@markmccoid/tmdb_api";

export type SearchConfig = {
  queryType: string;
  searchString: string | null;
  predefinedType: "Popular" | null;
  genres: string[] | null;
  releaseYear: number | null;
  watchProviders: string[] | null;
};
type State = {
  isNewQuery: boolean;
  resultData: TVSearchItem[];
  resultCurrentPage: number | null;
  resultTotalPages: number | null;
  isLoading: boolean;
  allGenres: AllGenres[];
  discoverSortBy: SortByOptions;
} & SearchConfig;

const state: State = {
  isNewQuery: true,
  resultData: [],
  resultCurrentPage: undefined,
  resultTotalPages: undefined,
  isLoading: false,
  allGenres: [], // [ { id, name }, ...]
  discoverSortBy: "popularity.desc",
  //--These are search value
  searchString: "",
  queryType: "predefined",
  predefinedType: "Popular",
  watchProviders: undefined,
  genres: undefined,
  releaseYear: undefined,
};

export const config = {
  state,
  actions,
  effects,
};
