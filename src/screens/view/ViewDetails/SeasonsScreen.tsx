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

import DetailSeason from "../../../components/ViewTVShows/DetailSeason";
//@types
import { SeasonsScreenProps } from "../viewTypes";

import { useOActions, useOState } from "../../../store/overmind";
import { colors } from "../../../globalStyles";
import { PrivateValueStore } from "@react-navigation/native";

const SeasonsScreen = ({ navigation, route }: SeasonsScreenProps) => {
  const routeName = route.name;
  const tvShowId = route.params?.tvShowId;
  let seasonNumbers = route.params?.seasonNumbers;
  const logo = route.params?.logo;

  const actions = useOActions();
  const state = useOState();
  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] = React.useState(undefined);
  const [seasonState, setSeasonState] = React.useState(undefined);
  const { getTVShowSeasonData, apiGetTVShowDetails } = actions.oSaved;
  const { getTVShowSeasons } = state.oSaved;

  const getSeasonData = async () => {
    setLoading(true);
    if (!seasonNumbers) {
      const show = await apiGetTVShowDetails(tvShowId);
      seasonNumbers = show.data.seasons.map((season) => season.seasonNumber);
    }
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    const seasonDets = getTVShowSeasons(tvShowId);
    setSeasonData(seasonDets);
    setSeasonState(
      seasonDets.reduce((final, season) => {
        final = { ...final, [season.seasonNumber]: false };
        return final;
      }, {})
    );
    setLoading(false);
  };
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
  //* RENDER ITEM function
  const renderItem = ({ item }) => {
    if (!item) return null;
    return (
      <DetailSeason
        key={item.seasonNumber}
        seasonNumber={item.seasonNumber}
        seasonName={item.name}
        tvShowId={tvShowId}
        seasonState={seasonState[item.seasonNumber]}
        toggleSeasonState={() =>
          setSeasonState((prev) => ({
            ...prev,
            [item.seasonNumber]: !prev[item.seasonNumber],
          }))
        }
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.logoContainer}>
        {!logo.logoURL ? (
          <Text style={styles.showName}>{logo.showName}</Text>
        ) : (
          <Image source={{ uri: logo.logoURL }} style={{ width: 171, height: 50 }} />
        )}
      </View>
      {/* only show "Header" is calling route is ViewStackSeasons */}
      {routeName === "ViewStackSeasons" && <Header />}
      <FlatList
        style={{ padding: 0 }}
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

export default SeasonsScreen;
