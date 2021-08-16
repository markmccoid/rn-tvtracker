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
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { useOActions, useOState } from "../../store/overmind";
import { colors } from "../../globalStyles";
import DetailSeasonEpisode from "./DetailSeasonEpisode";
//@types
import {
  SectionListDataItem,
  SectionListTitle,
  Separators,
} from "../../screens/view/ViewDetails/SeasonScreenSection";

type SectionHeaderProps = {
  section: SectionListTitle & {
    data: SectionListDataItem[];
  };
};
export const sectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  const { data } = section;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",

        // marginTop: 10,
        backgroundColor: "#2196f3",
        padding: 10,
      }}
    >
      <Text style={{ fontSize: 24 }}>
        {title.seasonName} - {data.length}
      </Text>
    </View>
  );
};

type SectionDataProps = {
  item: SectionListDataItem;
  index: number;
  section: SectionListTitle;
  separators: Separators;
};

export const sectionData = ({ item, index, section, separators }: SectionDataProps) => {
  const itemData: SectionListDataItem = item;

  return (
    <>
      <EpisodeRow tvShowId={itemData.tvShowId} episode={itemData.episode} />
    </>
  );
};

const EpisodeRow = ({ tvShowId, episode }) => {
  const state = useOState();
  const episodeState = state.oSaved.getTVShowEpisodeState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );

  return (
    <View>
      <DetailSeasonEpisode tvShowId={tvShowId} episode={episode} episodeState={episodeState} />
    </View>
  );
};
