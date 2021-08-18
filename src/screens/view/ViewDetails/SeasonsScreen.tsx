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
import { ScrollView } from "react-native-gesture-handler";
import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";

type SeasonState = { [seasonNumber: number]: boolean } & {
  seasonCount: number;
};

const SeasonsScreen = ({ navigation, route }: SeasonsScreenProps) => {
  const routeName = route.name;
  const tvShowId = route.params?.tvShowId;
  let seasonNumbers = route.params?.seasonNumbers;
  const logo = route.params?.logo;

  const actions = useOActions();
  const state = useOState();

  const [loading, setLoading] = React.useState(false);
  const [seasonData, setSeasonData] =
    React.useState<Omit<TVShowSeasonDetails, "episodes">[]>(undefined);
  const [seasonState, setSeasonState] = React.useState<SeasonState>(undefined);
  const { getTVShowSeasonData, apiGetTVShowDetails } = actions.oSaved;
  const { getTVShowSeasons } = state.oSaved;

  const getSeasonData = async () => {
    setLoading(true);
    // Season numbers will be passed if coming from the Details screen
    if (!seasonNumbers) {
      const show = await apiGetTVShowDetails(tvShowId);
      seasonNumbers = show.data.seasons.map((season) => season.seasonNumber);
    }
    await getTVShowSeasonData({ tvShowId, seasonNumbers });
    const seasonDets = getTVShowSeasons(tvShowId);
    setSeasonData(seasonDets);
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
      {/* <FlatList
        style={{ padding: 0 }}
        data={seasonData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
      /> */}
      <ScrollView
        scrollEventThrottle={100}
        onScroll={(ev) => {
          const { contentInset, contentOffset, contentSize, layoutMeasurement, zoomScale } =
            ev.nativeEvent;
          // console.log(contentOffset.y, contentSize);

          // nativeEvent: {
          //   contentInset: {bottom, left, right, top},
          //   contentOffset: {x, y},
          //   contentSize: {height, width},
          //   layoutMeasurement: {height, width},
          //   zoomScale
          // }}
        }}
      >
        {seasonData.map((item, idx, dataArray) => {
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
        })}
      </ScrollView>
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
