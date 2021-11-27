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
  SectionListTitleObj,
  Separators,
} from "../../screens/view/ViewDetails/SeasonScreen";
import SeasonHeader from "./SeasonHeader";
import { AnimatePresence, MotiView } from "moti";

type SectionHeaderProps = {
  section: {
    title: SectionListTitleObj;
    data: SectionListDataItem[];
  };
};

export const sectionHeader = ({ section }: SectionHeaderProps) => {
  const { title } = section;
  // const { data } = section;
  return (
    <SeasonHeader
      tvShowId={title.tvShowId}
      seasonNumber={title.seasonNumber}
      seasonName={title.seasonName}
      numberOfEpisodes={title.numberOfEpisodes}
      isShowSaved={title.isShowSaved}
    />
  );
};

type SectionDataProps = {
  item: SectionListDataItem;
  index: number;
  section: { title: SectionListTitleObj };
  separators: Separators;
};

//* --------------------------------------
//* - This is the episode rendering
//* --------------------------------------
export const sectionData = ({ item, index, section, separators }: SectionDataProps) => {
  const itemData: SectionListDataItem = item;
  const isShowSaved = section.title.isShowSaved;
  // const isDownloadStateEnabled = section.title.isDownloadStateEnabled;

  return (
    <>
      <EpisodeRow
        tvShowId={section.title.tvShowId}
        episode={itemData}
        isShowSaved={isShowSaved}
      />
    </>
  );
};

type EpisodeRowProps = {
  tvShowId: number;
  episode: SectionListDataItem;
  isShowSaved: boolean;
};
// Needed a component to be able to access overmind state
const EpisodeRow = React.memo(({ tvShowId, episode, isShowSaved }: EpisodeRowProps) => {
  const state = useOState();
  const actions = useOActions();
  const episodeState = state.oSaved.getTVShowEpisodeState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );
  const episodeDownloadState = state.oSaved.getTVShowDownloadState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );

  // Read episodeDownloadState from oSaved

  return (
    <>
      {/* <MotiView
        key="visible"
        from={{ opacity: 0.5, translateX: -400 }}
        animate={{ opacity: 1.0, translateX: 0 }}
        transition={{ type: "spring" }}
      > */}
      <DetailSeasonEpisode
        tvShowId={tvShowId}
        episode={episode}
        episodeState={episodeState}
        episodeDownloadState={episodeDownloadState}
        isShowSaved={isShowSaved}
      />
      {/* </MotiView> */}
    </>
  );
});
