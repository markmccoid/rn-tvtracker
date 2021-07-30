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
  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState(undefined);
  const { getTVShowSeasonData, clearTempSeasonData, toggleTVShowEpisodeState } =
    actions.oSaved;
  const { tempSeasonsData, getTVShowSeasonDetails, getTVShowSeasons } = state.oSaved;
  const getSeasonData = async () => {
    setLoading(true);
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    setSeasonData(getTVShowSeasons(tvShowId));
    setLoading(false);
  };
  React.useEffect(() => {
    getSeasonData();
    // return () => console.log("unmount");
  }, [tvShowId]);

  if (loading || !seasonData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <Text>DETAIL SEASONS</Text>
      <ScrollView style={{ padding: 0, margin: 0 }}>
        {seasonData &&
          seasonData.map((season) => {
            return <DetailSeason key={season.id} season={season} tvShowId={tvShowId} />;
          })}
      </ScrollView>
    </View>
  );
};

export default DetailSeasonsScreen;
