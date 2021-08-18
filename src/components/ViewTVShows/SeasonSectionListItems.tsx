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

  return (
    <>
      <EpisodeRow tvShowId={itemData.tvShowId} episode={itemData.episode} />
    </>
  );
};

// Needed a component to be able to access overmind state
const EpisodeRow = ({ tvShowId, episode }) => {
  const state = useOState();
  const episodeState = state.oSaved.getTVShowEpisodeState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );
  const seasonState = state.oSaved.getTVShowSeasonState(tvShowId, episode.seasonNumber);
  // if (!seasonState) {
  //   return <View style={{ height: 0 }} />;
  // }
  return (
    <AnimatePresence exitBeforeEnter>
      {seasonState && (
        <MotiView
          key="visible"
          from={{ translateX: -400 }}
          animate={{ translateX: 0 }}
          exit={{ translateX: -400 }}
          exitTransition={{ type: "timing", duration: 100 }}
          transition={{ type: "spring" }}
        >
          <DetailSeasonEpisode
            tvShowId={tvShowId}
            episode={episode}
            episodeState={episodeState}
          />
        </MotiView>
      )}
      {!seasonState && (
        <MotiView animate={{ height: 0 }} style={{ backgroundColor: "yellow" }} />
      )}
    </AnimatePresence>
  );
};
