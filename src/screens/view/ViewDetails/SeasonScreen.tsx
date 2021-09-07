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
} from "react-native";
import _ from "lodash";

import { CloseIcon } from "../../../components/common/Icons";

import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

import {
  sectionData,
  sectionHeader,
} from "../../../components/ViewTVShows/SeasonSectionListItems";

//@types
import { SeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";
import { colors } from "../../../globalStyles";
import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";

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

type SeasonPicker = {
  seasonNumber: number;
  seasonText: string;
  episodesWatched: number;
};
const prepareSeasonPicker = (
  tvShowId: number,
  seasons: number[],
  getWatchedEpisodes
): SeasonPicker[] => {
  return seasons.map((season) => {
    return {
      seasonNumber: season,
      seasonText: `Season ${season}`,
      episodesWatched: getWatchedEpisodes(tvShowId, season),
    };
  });
};
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

  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState<SectionListType[]>([]);
  const [seasonPicker, setSeasonPicker] = React.useState<number[]>([]);
  const [seasonState, setSeasonState] = React.useState<SeasonState>(undefined);
  const { getTVShowSeasonData, apiGetTVShowDetails } = actions.oSaved;
  const { getTVShowSeasonDetails, getWatchedEpisodes } = state.oSaved;

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

    //prepareSeasonPicker(tvShowId, seasonNumbers, state.oSaved.getWatchedEpisodes)
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

  //----------------------
  const sectionGetItemLayout = sectionListGetItemLayout({
    // The height of the row with rowData at the given sectionIndex and rowIndex
    getItemHeight: (rowData, sectionIndex, rowIndex) => (sectionIndex === 0 ? 62 : 55),
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
        <ScrollView horizontal>
          {seasonPicker.map((season) => {
            if (season === 0) return;
            return (
              <TouchableOpacity
                key={season}
                style={{
                  margin: 5,
                  padding: 5,
                  borderWidth: 1,
                  borderRadius: 10,
                  backgroundColor: colors.darkbg,
                }}
                onPress={() =>
                  sectionRef.current?.scrollToLocation({
                    sectionIndex: season - 1,
                    itemIndex: 0,
                    viewPosition: 0,
                    animated: true,
                  })
                }
              >
                <Text
                  style={{
                    color: colors.darkfg,
                  }}
                >
                  {`Season ${season}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <SectionList
        ref={sectionRef}
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
