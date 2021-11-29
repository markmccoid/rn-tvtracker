import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import _ from "lodash";

import { CheckIcon, CloseIcon, HardDriveIcon } from "../../../components/common/Icons";

import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

import {
  sectionData,
  sectionHeader,
} from "../../../components/ViewTVShows/SeasonSectionListItems";

//@types
import { SeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";
import { colors, styleHelpers } from "../../../globalStyles";
import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";
import PressableButton from "../../../components/common/PressableButton";

type SeasonState = { [seasonNumber: number]: boolean } & {
  seasonCount: number;
};

export type SectionListTitleObj = {
  tvShowId: number;
  seasonName: string;
  seasonNumber: number;
  numberOfEpisodes: number;
  seasonState: boolean;
  isShowSaved: boolean;
};

export type SectionListDataItem = {
  id: number;
  name: string;
  episodeNumber: number;
  airDate: string;
  seasonNumber: number;
};

// type SectionListType = { title: SectionListTitle; data: SectionListDataItem[] };

type SectionListType = {
  title: SectionListTitleObj;
  data: SectionListDataItem[];
};

export type Separators = {
  highlight: () => void;
  unhighlight: () => void;
  updateProps: (select: "leading" | "trailing", newProps: any) => void;
};
//* -----------------------------
//* takes the seasonDetail and tvShowId and
//* returns data formatted for SectionList component
//* -----------------------------
const formatForSectionList = (
  tvShowId: number,
  seasonDetails: TVShowSeasonDetails[],
  isShowSaved: boolean
): SectionListType[] => {
  // return the initial seasonState array.
  // if only 1 season, then make it open by default
  const seasonStates = seasonDetails.reduce((final, season, index, array) => {
    return { ...final, [season.seasonNumber]: array.length > 1 ? false : true };
  }, {});
  const sectionArray = seasonDetails.map((season) => {
    const title = {
      tvShowId: tvShowId,
      seasonName: season.name,
      seasonNumber: season.seasonNumber,
      numberOfEpisodes: season.episodes.length,
      seasonState: seasonStates[season.seasonNumber],
      isShowSaved,
    };
    const episodes = season.episodes.map((episode) => {
      return {
        id: episode.id,
        name: episode.name,
        episodeNumber: episode.episodeNumber,
        airDate: episode.airDate?.formatted,
        seasonNumber: episode.seasonNumber,
      };
    });
    return {
      title,
      data: episodes,
    };
  });

  return sectionArray;
};

// type SeasonPicker = {
//   seasonNumber: number;
//   seasonText: string;
//   episodesWatched: number;
// };
// const prepareSeasonPicker = (
//   tvShowId: number,
//   seasons: number[],
//   getSeasonEpisodeStateCount
// ): SeasonPicker[] => {
//   return seasons.map((season) => {
//     return {
//       seasonNumber: season,
//       seasonText: `Season ${season}`,
//       episodesWatched: getSeasonEpisodeStateCount(tvShowId, season),
//     };
//   });
// };
/**
//* SeasonsScreen Component
*/
const SeasonsScreen = ({ navigation, route }: SeasonsScreenProps) => {
  const tvShowId = route.params?.tvShowId;
  let seasonNumbers = route.params?.seasonNumbers;
  const logo = route.params?.logo;
  const actions = useOActions();
  const state = useOState();
  const sectionRef = React.useRef<SectionList<any> | undefined>();
  const horizontalRef = React.useRef<ScrollView>(undefined);
  const seasonButtonWidth = React.useRef<number>(0);
  const firstOpenRef = React.useRef<boolean>(true);

  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState<SectionListType[]>([]);
  const [seasonPicker, setSeasonPicker] = React.useState<number[]>([]);
  const [seasonState, setSeasonState] = React.useState<SeasonState>(undefined);
  const { getTVShowSeasonData, apiGetTVShowDetails, getLastestEpisodeWatched } =
    actions.oSaved;
  const { getTVShowSeasonDetails, getSeasonEpisodeStateCount, getNotWatchedEpisodeCount } =
    state.oSaved;
  const { isDownloadStateEnabled } = state.oSaved.settings;

  const getSeasonData = async () => {
    setLoading(true);
    // Find out if show is saved yet
    const isShowSaved = _.some(state.oSaved.savedTVShows, ["id", tvShowId]);
    // Season numbers will be passed if coming from the Details screen
    // but won't be if coming from long press on show in main screen
    if (!seasonNumbers) {
      const show = await apiGetTVShowDetails(tvShowId);
      seasonNumbers = show.data.seasons.map((season) => season.seasonNumber);
    }
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    const seasonDets = getTVShowSeasonDetails(tvShowId);

    //prepareSeasonPicker(tvShowId, seasonNumbers, state.oSaved.getSeasonEpisodeStateCount)
    setSeasonPicker(seasonNumbers);
    setSeasonData(formatForSectionList(tvShowId, seasonDets, isShowSaved));

    setLoading(false);
  };
  //-- USE EFFECTS
  React.useEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, []);
  React.useEffect(() => {
    getSeasonData();
  }, [tvShowId]);

  //* Used to know when all shows thus far have been marked as watched.
  //* using firstOpenRef so that the Alert doesn't happen if we are already
  //* at zero watched when seasonScreen is opened.
  React.useEffect(() => {
    if (!firstOpenRef.current) {
      if (getNotWatchedEpisodeCount(tvShowId) === 0) {
        Alert.alert(
          "All Watched",
          "You've watched all episodes that are available!  Update your tags!"
        );
      }
    } else {
      firstOpenRef.current = false;
    }
  }, [getNotWatchedEpisodeCount(tvShowId)]);

  // React.useEffect(() => {
  //   if (!sectionRef.current) return;
  //   const [latestSeason, latestEpisode] = getLastestEpisodeWatched({ tvShowId });
  //   console.log("latest", latestSeason);
  // sectionRef.current?.scrollToLocation({
  //   sectionIndex: 1,
  //   itemIndex: 0,
  //   viewPosition: 0,
  //   animated: true,
  // });
  // }, [sectionRef.current]);
  //----------------------
  const sectionGetItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 0 ? 62 : 62),
  });

  if (loading || !seasonData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  //* Optional HEADER JSX
  const Header = () => (
    <View>
      <Text>Optional Header</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.logoContainer}>
        {!logo.logoURL ? (
          <Text style={styles.showName}>{logo.showName}</Text>
        ) : (
          <Image source={{ uri: logo.logoURL }} style={{ width: 171, height: 50 }} />
        )}
        <TouchableOpacity
          style={{ position: "absolute", right: 10, top: 5 }}
          onPress={() => navigation.goBack()}
        >
          <CloseIcon color={"white"} size={25} />
        </TouchableOpacity>
      </View>
      {/* only show "Header" is calling route is ViewStackSeasons */}
      {/* {routeName === "ViewStackSeasons" && <Header />} */}
      {/* <ScrollView
        horizontal
        contentContainerStyle={{ height: 20, borderWidth: 1 }}
        style={{ height: 25, borderWidth: 1 }}
      >
        <Text>Hi</Text>
      </ScrollView> */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={horizontalRef}
          onLayout={() => {
            // Scroll to the latest season position, dependant upon seasonButtonWidth ref
            // which is set in the onLayout for the season button inner view
            const [latestSeason, latestEpisode] = getLastestEpisodeWatched(tvShowId);

            const scrollDist =
              latestSeason === 1 ? 0 : latestSeason * seasonButtonWidth.current;
            horizontalRef.current?.scrollTo({ x: scrollDist, y: 0, animated: true });
          }}
        >
          {seasonPicker.map((season) => {
            if (season === 0) return;
            //Get episode watched info to style horizontal season menu
            //all episodes watch gets special styling for season button
            const episodesWatched = state.oSaved.getSeasonEpisodeStateCount(tvShowId, season);
            const numberOfEpisodes = seasonData.find((el) => el.title.seasonNumber === season)
              .title.numberOfEpisodes;
            const allEpisodesWatched = !!!(numberOfEpisodes - episodesWatched);
            //Downloaded episodes
            const episodesDownloaded = state.oSaved.getSeasonEpisodeStateCount(
              tvShowId,
              season,
              true
            );
            // will always be false if isDownloadStateEnabled == false
            const allEpisodesDownloaded =
              !!!(numberOfEpisodes - episodesDownloaded) && isDownloadStateEnabled;

            return (
              <PressableButton
                key={season}
                onPress={() => {
                  sectionRef.current?.scrollToLocation({
                    sectionIndex: season - 1,
                    itemIndex: 0,
                    viewPosition: 0,
                    animated: true,
                  });
                  setTimeout(
                    () =>
                      sectionRef.current?.scrollToLocation({
                        sectionIndex: season - 1,
                        itemIndex: 0,
                        viewPosition: 0,
                        animated: true,
                      }),
                    500
                  );
                }}
                style={[
                  styleHelpers.buttonShadow,
                  {
                    margin: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    backgroundColor: allEpisodesWatched ? colors.darkbg : colors.buttonPrimary,
                    borderWidth: StyleSheet.hairlineWidth,
                    borderColor: allEpisodesDownloaded ? colors.excludeRed : colors.darkbg,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingRight: allEpisodesWatched ? 0 : 10,
                    paddingLeft: allEpisodesDownloaded ? 0 : 10,
                  }}
                  onLayout={(e) => {
                    seasonButtonWidth.current = e.nativeEvent.layout.width;
                    // console.log(
                    //   "containerHeight",
                    //   e.nativeEvent.layout.height,
                    //   e.nativeEvent.layout.width,
                    //   e.nativeEvent.layout.x
                    // );
                  }}
                >
                  {allEpisodesDownloaded && (
                    <HardDriveIcon
                      size={15}
                      color={allEpisodesDownloaded ? colors.excludeRed : colors.buttonPrimary}
                    />
                  )}
                  <Text
                    style={{
                      fontWeight: "600",
                      color: allEpisodesWatched ? "white" : colors.buttonTextDark,
                      fontSize: 14,
                      paddingRight: allEpisodesWatched ? 5 : 10,
                      paddingLeft: allEpisodesDownloaded ? 5 : 10,
                    }}
                  >
                    {`Season ${season}`}
                  </Text>

                  {allEpisodesWatched && (
                    <CheckIcon
                      size={15}
                      color={allEpisodesWatched ? "white" : colors.buttonPrimary}
                    />
                  )}
                </View>
              </PressableButton>
            );
          })}
        </ScrollView>
      </View>
      <SectionList
        ref={sectionRef}
        onLayout={() => {
          // try and scroll to latest season/episode
          const [latestSeason, latestEpisode] = getLastestEpisodeWatched(tvShowId);
          sectionRef.current?.scrollToLocation({
            sectionIndex: latestSeason - 1,
            itemIndex: 0,
            viewPosition: 0,
            animated: false,
          });
          setTimeout(
            () =>
              sectionRef.current?.scrollToLocation({
                sectionIndex: latestSeason - 1,
                itemIndex: latestEpisode,
                viewPosition: 0,
                animated: true,
              }),
            500
          );
        }}
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingBottom: 55 }}
        sections={seasonData}
        keyExtractor={(item: SectionListDataItem, index: number) =>
          item.seasonNumber.toString() + item.episodeNumber.toString()
        }
        renderItem={sectionData}
        renderSectionHeader={sectionHeader}
        // onScroll={(event) => {
        //   console.log(event.nativeEvent.contentOffset.y);
        // }}
        getItemLayout={sectionGetItemLayout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.commonBorder,
    borderTopWidth: 1,
    borderTopColor: colors.commonBorder,
    backgroundColor: "#313131", //colors.background,
  },
  showName: {
    fontSize: 20,
    fontWeight: "600",
    alignItems: "center",
    color: "#dedede",
  },
});

export default SeasonsScreen;
