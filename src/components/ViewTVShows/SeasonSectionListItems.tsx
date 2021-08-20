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
} from "../../screens/view/ViewDetails/SeasonScreen";
import SeasonHeader from "./SeasonHeader";
import { AnimatePresence, MotiView } from "moti";

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
      }}
    >
      <SeasonHeader
        tvShowId={title.tvShowId}
        seasonNumber={title.seasonNumber}
        seasonName={title.seasonName}
        numberOfEpisodes={title.numberOfEpisodes}
        isShowSaved={title.isShowSaved}
      />
    </View>
  );
};

type SectionDataProps = {
  item: SectionListDataItem;
  index: number;
  section: SectionListTitle;
  separators: Separators;
};

//* --------------------------------------
//* - This is the episode rendering
//* --------------------------------------
export const sectionData = ({ item, index, section, separators }: SectionDataProps) => {
  const itemData: SectionListDataItem = item;
  const isShowSaved = section.title.isShowSaved;

  return (
    <>
      <EpisodeRow
        tvShowId={itemData.tvShowId}
        episode={itemData.episode}
        isShowSaved={isShowSaved}
      />
    </>
  );
};

// Needed a component to be able to access overmind state
const EpisodeRow = ({ tvShowId, episode, isShowSaved }) => {
  const state = useOState();
  const episodeState = state.oSaved.getTVShowEpisodeState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );
  const seasonState = state.oSaved.getTVShowSeasonState(tvShowId, episode.seasonNumber);
  if (!seasonState) {
    // return <MotiView from={{ height: 20 }} animate={{ height: 0 }} />;
    return <View style={{ height: 0 }} />;
  }
  return (
    <>
      <MotiView
        key="visible"
        from={{ opacity: 0.5, translateX: -400 }}
        animate={{ opacity: 1.0, translateX: 0 }}
        transition={{ type: "spring" }}
      >
        <DetailSeasonEpisode
          tvShowId={tvShowId}
          episode={episode}
          episodeState={episodeState}
          isShowSaved={isShowSaved}
        />
      </MotiView>
    </>
  );
};
