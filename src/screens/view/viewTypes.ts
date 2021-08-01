import { RouteProp } from "@react-navigation/native";
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from "react-native-screens/native-stack";

//* Screens in the Main stacks
//- Main View stack
export type ViewTVStackParamList = {
  ViewTVShows: undefined;
  Details: { tvShowId: number; notSaved: boolean };
  DetailsPerson: { personId: number; fromRouteName: string };
  DetailSeasons: {
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

//- ViewTVShows Stack
export type ViewTVShowsParamList = {
  TVShowsScreen: undefined;
  Filter: undefined;
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
export type DetailSeasonsScreenProps = NativeStackScreenProps<
  ViewTVStackParamList,
  "DetailSeasons"
>;

//- Detail Person
export type DetailPersonScreenProps = NativeStackScreenProps<
  ViewTVStackParamList,
  "DetailPerson"
>;

//* Types for useNavigation hooks
// Details Screen
export type DetailsScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "Details"
>;

// DetailSeasons screen
export type DetailSeasonsScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "DetailSeasons"
>;

// DetailSeasons screen
export type DetailPersonScreenNavigation = NativeStackNavigationProp<
  ViewTVStackParamList,
  "DetailPerson"
>;

//* Types for useRoute hooks
export type DetailSeasonsScreenRouteProp = RouteProp<ViewTVStackParamList, "DetailSeasons">;
export type DetailPersonScreenRouteProp = RouteProp<ViewTVStackParamList, "DetailPerson">;
