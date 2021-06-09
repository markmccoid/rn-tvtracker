export type Operators = "AND" | "OR";
export type SortTypes = "alpha" | "num" | "date";
export type DateOptions = {
  epoch: number;
  formatted: string;
};

/**
 * Data that is saved in Firestore for every movie user saves
 *
 * @export
 * @interface ISavedMovieDoc
 */
export interface ISavedMovieDoc {
  // from tmdb API
  id: string;
  title: string;
  overview: string;
  releaseDate: DateOptions;
  backdropURL: string;
  posterURL: string;
  genres: string[];
  budget: string;
  imdbId: string;
  imdbURL: string;
  revenue: number;
  runtime: number;
  status: string;
  tagLine: string;
  // Application created
  taggedWith?: string[];
  userRating: number;
  savedDate: number;
}

/**
 * Data for any filters that users saves to firestore.
 *
 * @export
 * @interface ISavedFilters
 */
export interface ISavedFilters {
  id: string;
  name: string;
  // Position of filter in scrollview
  index: number;
  excludeTagOperator: Operators;
  excludeTags: string[];
  genreOperator: Operators;
  genres: string[];
  showInDrawer: boolean;
  tagOperator: Operators;
  tags: string[];
}

/**
 * The default sort is made up of the sort items available to the user
 * Currently they are
 *   - Release Date
 *   - Saved Date
 *   - Title
 *   - User Rating
 * The index indicates in which order to apply each sort item and then only if
 * the active field is "true"
 * @export
 * @interface IDefaultSortItem
 */
export interface IDefaultSortItem {
  id: string;
  index: number;
  active: boolean;
  sortDirection: string;
  sortField: string;
  title: string;
  type: SortTypes;
}

export interface ISettings {
  defaultFilter: string;
  // An array of sort object that will determine how the sort is performed
  defaultSort: IDefaultSortItem[];
}

/**
 * The set of user defined tags.
 *
 * @export
 * @interface ITags
 */
export interface ITags {
  tagId: string;
  tagName: string;
}

export interface IUserBaseData {
  email?: string;
  savedFilters: ISavedFilters[];
  settings: ISettings | {};
  tagData: ITags[];
  dataSource: "cloud" | "local";
}
/**IUserDocument
 * Returned data from firestore for a User
 * Includes base data and also
 * savedMovies array which is a collection in Firestore
 */
export interface IUserDocument extends IUserBaseData {
  //savedMovies is not really an array in firestore, but I am loading it
  //so that it looks like an array.
  savedMovies: ISavedMovieDoc[];
}
