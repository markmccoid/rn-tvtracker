import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";

import DetailSeason from "../../../components/ViewTVShows/DetailSeason";
//@types
import { DetailSeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";
import { colors } from "../../../globalStyles";

const DetailSeasonsScreen = ({ navigation, route }: DetailSeasonsScreenProps) => {
  const tvShowId = route.params?.tvShowId;
  const seasonNumbers = route.params?.seasonNumbers;
  const logo = route.params?.logo;

  const actions = useOActions();
  const state = useOState();
  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState(undefined);
  const { getTVShowSeasonData, clearTempSeasonData, toggleTVShowEpisodeState } =
    actions.oSaved;
  const { tempSeasonsData, getTVShowSeasonDetails, getTVShowSeasons } = state.oSaved;

  const getSeasonData = async () => {
    setLoading(true);
    // if (!getTVShowSeasons(tvShowId)) {
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    // }
    setSeasonData(getTVShowSeasons(tvShowId));
    setLoading(false);
  };
  React.useEffect(() => {
    getSeasonData();
    // setSeasonData(getTVShowSeasons(tvShowId));
  }, [tvShowId]);

  if (loading || !seasonData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const renderItem = ({ item }) => {
    if (!item) return null;
    return <DetailSeason key={item.id} season={item} tvShowId={tvShowId} />;
  };

  return (
    <View>
      <View style={styles.logoContainer}>
        {!logo.logoURL ? (
          <Text style={styles.showName}>{logo.showName}</Text>
        ) : (
          <Image source={{ uri: logo.logoURL }} style={{ width: 171, height: 50 }} />
        )}
      </View>
      {/* <ScrollView style={{ padding: 0, marginBottom: 50 }}>
        {seasonData &&
          seasonData.map((season) => {
            return <DetailSeason key={season.id} season={season} tvShowId={tvShowId} />;
          })}
      </ScrollView> */}

      <FlatList
        data={seasonData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
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

export default DetailSeasonsScreen;
