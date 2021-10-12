import { TVShowDetails } from "@markmccoid/tmdb_api";
import { SavedTVShowsDoc } from "../store/oSaved/state";
import { DateObject, Operators, SortTypes, Datasource } from "./index";
import { SavedFilters, TagData, Settings, SavedEpisodeState } from "../store/oSaved/state";
/**
 * Data that is saved in Firestore for every movie user saves
 */

//?? Data that is pulled when querying the details record
//?? Should probably NOT need this as we will get it from tmdb_api .d.ts files.
export type DetailTVInfo = {
  id: string;
  name: string;
  overview: string;
  firstAirDate: DateObject;
  lastAirDate: DateObject;
  backdropURL: string;
  posterURL: string;
  genres: string[];
  popoularity: number;
  imdbId: string;
  imdbURL: string;
  avgEpisodeRunTime: number;
  numberOfEpisodes: number;
  numberOfSeasons: number;
  status: string;
  tagLine: string;
  // Application created
  taggedWith?: string[];
  userRating: number;
  dateSaved: number;
};

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
 * @interface DefaultSortItem
 */
export interface DefaultSortItem {
  id: string;
  index: number;
  active: boolean;
  sortDirection: string;
  sortField: string;
  title: string;
  type: SortTypes;
}

export interface UserBaseData {
  // email?: string;
  savedFilters: SavedFilters[];
  settings: Settings;
  tagData: TagData[];
  tempEpisodeState: SavedEpisodeState;
  dataSource: Datasource;
}
/**UserDocument
 * Returned data from firestore for a User
 * Includes base data and also
 * savedMovies array which is a collection in Firestore
 */
export interface UserDocument extends UserBaseData {
  //savedMovies is not really an array in firestore, but I am loading it
  //so that it looks like an array.
  savedTVShows: SavedTVShowsDoc[];
}

export interface UserBackupObject {
  savedFilters: SavedFilters[];
  settings: Settings;
  tagData: TagData[];
  dataSource: Datasource;
  savedTVShows: SavedTVShowsDoc[];
}
