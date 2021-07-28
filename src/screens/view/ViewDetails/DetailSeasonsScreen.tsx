import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";

import DetailSeason from "../../../components/ViewTVShows/DetailSeason";
//@types
import { DetailSeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";

const DetailSeasonsScreen = ({ navigation, route }: DetailSeasonsScreenProps) => {
  const tvShowId = route.params?.tvShowId;
  const seasonNumbers = route.params?.seasonNumbers;
  const actions = useOActions();
  const state = useOState();
  const { getTVShowSeasonData, clearTempSeasonData, setTVShowEpisode } = actions.oSaved;
  const { tempSeasonsData, getTVShowSeasonDetails } = state.oSaved;

  const getSeasonData = async () => {
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
  };
  React.useEffect(() => {
    getSeasonData();
  }, [tvShowId]);

  const seasonDetails = getTVShowSeasonDetails(tvShowId);

  const onSetTVShowEpisode =
    (tvShowId: number, seasonNumber: number) => (episodeNumber: number) =>
      setTVShowEpisode({ tvShowId, seasonNumber, episodeNumber });
  return (
    <View>
      <Text>DETAIL SEASONS</Text>
      <ScrollView style={{ padding: 0, margin: 0 }}>
        {seasonDetails &&
          seasonDetails.map((season) => {
            return (
              <DetailSeason
                key={season.id}
                season={season}
                tvShowId={tvShowId}
                onSetTVShowEpisode={onSetTVShowEpisode(tvShowId, season.seasonNumber)}
              />
            );
          })}
      </ScrollView>
    </View>
  );
};

export default DetailSeasonsScreen;
