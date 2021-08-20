import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  SectionList,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import _ from "lodash";

import DetailSeason from "../../../components/ViewTVShows/DetailSeason";
//@types
import { SeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";
import { colors } from "../../../globalStyles";
import { Episode, TVShowSeasonDetails } from "@markmccoid/tmdb_api";

import {
  sectionData,
  sectionHeader,
} from "../../../components/ViewTVShows/SeasonSectionListItems";

type SeasonState = { [seasonNumber: number]: boolean } & {
  seasonCount: number;
};

export type SectionListTitle = {
  title: {
    tvShowId: number;
    seasonName: string;
    seasonNumber: number;
    numberOfEpisodes: number;
    seasonState: boolean;
    isShowSaved: boolean;
  };
};

export type SectionListDataItem = {
  tvShowId: number;
  episode: Episode;
};
type SectionListData = {
  data: SectionListDataItem[];
};
type SectionListType = SectionListTitle & SectionListData;

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
        tvShowId,
        episode,
      };
    });
    return {
      title,
      data: episodes,
    };
  });
  return sectionArray;
};
const SeasonsScreen = ({ navigation, route }: SeasonsScreenProps) => {
  const tvShowId = route.params?.tvShowId;
  let seasonNumbers = route.params?.seasonNumbers;
  const logo = route.params?.logo;
  const actions = useOActions();
  const state = useOState();

  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState<SectionListType[]>([]);
  const [seasonState, setSeasonState] = React.useState<SeasonState>(undefined);
  const { getTVShowSeasonData, apiGetTVShowDetails } = actions.oSaved;
  const { getTVShowSeasonDetails } = state.oSaved;

  const getSeasonData = async () => {
    setLoading(true);
    // Find out if show is saved yet
    const isShowSaved = _.some(state.oSaved.savedTVShows, ["id", tvShowId]);
    // Season numbers will be passed if coming from the Details screen
    if (!seasonNumbers) {
      const show = await apiGetTVShowDetails(tvShowId);
      seasonNumbers = show.data.seasons.map((season) => season.seasonNumber);
    }
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    const seasonDets = getTVShowSeasonDetails(tvShowId);

    setSeasonData(formatForSectionList(tvShowId, seasonDets, isShowSaved));
    //* Below for determining if we should expand first season (if only 1 season for show)
    const tempSeasonStates = seasonDets.reduce<SeasonState>(
      (final: SeasonState, season): SeasonState => {
        const seasonCount = final?.seasonCount ? final.seasonCount + 1 : 1;
        final = { ...final, [season.seasonNumber]: false, seasonCount };
        return final;
      },
      {}
    );
    if (tempSeasonStates.seasonCount === 1) {
      tempSeasonStates[1] = true;
    }
    setSeasonState(tempSeasonStates);
    setLoading(false);
  };
  React.useEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, []);
  React.useEffect(() => {
    getSeasonData();
  }, [tvShowId]);

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
      </View>
      {/* only show "Header" is calling route is ViewStackSeasons */}
      {/* {routeName === "ViewStackSeasons" && <Header />} */}

      <SectionList
        style={{ width: "100%" }}
        sections={seasonData}
        keyExtractor={(item, index) => item.tvShowId.toString() + index}
        renderItem={sectionData}
        renderSectionHeader={sectionHeader}
        extraData={[state.oSaved.tempSeasonsState, state.oSaved.tempSeasonsData]}
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
