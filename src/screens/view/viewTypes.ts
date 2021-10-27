import { RouteProp } from "@react-navigation/native";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "react-native-screens/native-stack";

//* Screens in the Main stacks
//- Main View stack
export type ViewTVStackParamList = {
  ViewTVShows: undefined;
  // Details: { tvShowId: number; notSaved: boolean };
  DetailsModal:
    | {
        screen: "Details";
        params: { tvShowId: number; notSaved: boolean };
      }
    | {
        screen: "DetailsSeasons";
        params: {
          tvShowId: number;
          // an array with the season numbers returned for tvShowId
          // sometimes Season 0 is included sometimes not
          seasonNumbers: number[];
          // Need aspect ratio as all logos are different:
          // height * aspect = width
          // width / aspect = height
          logo?: { logoURL?: string; aspectRatio?: number; showName?: string };
        };
      }
    | {
        screen: "DetailsPickImage";
        params: {
          tvShowId: number;
        };
      };
  DetailsPerson: { personId: number; fromRouteName: string };
  DetailsSeasons: {
    tvShowId: number;
    // an array with the season numbers returned for tvShowId
    // sometimes Season 0 is included sometimes not
    seasonNumbers: number[];
    // Need aspect ratio as all logos are different:
    // height * aspect = width
    // width / aspect = height
    logo?: { logoURL?: string; aspectRatio?: number; showName?: string };
  };
};

export type SearchStackParamList = {
  DetailsFromSearchModal:
    | {
        screen: "DetailsFromSearch";
        params: { tvShowId: number; notSaved: boolean };
      }
    | {
        screen: "DetailsFromSearchSeasons";
        params: {
          tvShowId: number;
          // an array with the season numbers returned for tvShowId
          // sometimes Season 0 is included sometimes not
          seasonNumbers: number[];
          // Need aspect ratio as all logos are different:
          // height * aspect = width
          // width / aspect = height
          logo?: { logoURL?: string; aspectRatio?: number; showName?: string };
        };
      };
  DetailsFromSearchPerson: { personId: number; fromRouteName: string };
  Search: undefined;
};

//- ViewTVShows Stack
export type ViewTVShowsParamList = {
  TVShowsScreen: undefined;
  Filter: undefined;
  ViewStackSeasons: {
    tvShowId: number;
    // Need aspect ratio as all logos are different:
    // height * aspect = width
    // width / aspect = height
    logo?: { logoURL?: string; aspectRatio?: number; showName?: string };
  };
  ViewStackSeasonsEpisode: {
    tvShowId: number;
    seasonNumber: number;
    episodeNumber: number;
  };
  ViewStackSeasonsEpisodePerson: {
    personId: number;
    fromRouteName: string;
  };
};

//* Create Props to be used by each of the screens
//- Main View screen
export type ViewTVShowsScreenProps = NativeStackScreenProps<
  ViewTVStackParamList,
  "ViewTVShows"
>;

//- Details
export type DetailsScreenProps = NativeStackScreenProps<ViewTVStackParamList, "Details">;

//- DetailSeasons
export type SeasonsScreenProps = NativeStackScreenProps<
  ViewTVStackParamList,
  "DetailsSeasons"
>;

//- Detail Person
export type DetailPersonScreenProps = NativeStackScreenProps<
  ViewTVStackParamList,
  "DetailsPerson"
>;

//* Types for useNavigation hooks
// Details Screen
export type DetailsScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "Details"
>;
// Search Details
export type DetailsSearchScreenNavigation = NativeStackNavigationProp<
  SearchStackParamList,
  "DetailsFromSearchModal"
>;

// DetailSeasons screen
export type DetailSeasonsScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "DetailsSeasons"
>;

// DetailSeasons screen
export type DetailPersonScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "DetailsPerson"
>;

//* Types for useRoute hooks
export type DetailSeasonsScreenRouteProp = RouteProp<ViewTVStackParamList, "DetailsSeasons">;
export type DetailPersonScreenRouteProp = RouteProp<ViewTVStackParamList, "DetailsPerson">;
export type DetailsScreenRouteProp = RouteProp<ViewTVStackParamList, "Details">;
