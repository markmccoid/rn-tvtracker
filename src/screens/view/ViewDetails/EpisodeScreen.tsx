import { TVShowEpisodeDetails } from "@markmccoid/tmdb_api";
import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useOState, useOActions } from "../../../store/overmind";

import PosterImage from "../../../components/common/PosterImage";
import { colors, styleHelpers } from "../../../globalStyles";
import DetailCastInfo from "./DetailCastInfo";
import { color } from "react-native-reanimated";
import { CloseIcon } from "../../../components/common/Icons";

const { width, height } = Dimensions.get("window");
const MARGIN = 5;

const EpisodeScreen = ({ navigation, route }) => {
  // console.log("Route parms, episodescreen", route.params);
  // console.log("Route", route.name);

  const { tvShowId, seasonNumber, episodeNumber } = route.params;
  const [episodeDetails, setEpisodeDetails] = React.useState<TVShowEpisodeDetails>();

  const state = useOState();
  const actions = useOActions();
  const { apiGetTVShowEpisodeDetails } = actions.oSaved;

  const getEpisodeDetails = async () => {
    const dets = await apiGetTVShowEpisodeDetails({ tvShowId, seasonNumber, episodeNumber });
    setEpisodeDetails(dets.data);
  };
  // When show/season/episode change, query API for episode details.
  React.useEffect(() => {
    getEpisodeDetails();
  }, [tvShowId, seasonNumber, episodeNumber]);
  if (!episodeDetails) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // stillURL image 300x169
  // width * .5634 = height
  const stillWidth = width - 2;
  const stillHeight = stillWidth * 0.5634;
  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 100,
          borderWidth: StyleSheet.hairlineWidth,
          borderBottomLeftRadius: 5,
          backgroundColor: `${colors.background}77`,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 5 }}>
          <CloseIcon size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          borderBottomColor: colors.commonBorder,
          borderBottomWidth: 1,
          // shadowColor: "#000",
          // shadowOffset: { width: 0, height: 2 },
          // shadowOpacity: 0.8,
          // shadowRadius: 2,
        }}
      >
        <PosterImage
          uri={episodeDetails.stillURL}
          placeholderText="Still Image"
          posterWidth={stillWidth}
          posterHeight={stillHeight}
        />
      </View>
      {/* Episode Title Panel */}
      <View style={{ backgroundColor: colors.background }}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            backgroundColor: colors.buttonPrimary,
            padding: 5,
            borderWidth: 1,
            borderColor: colors.listBorder,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ fontWeight: "600", fontSize: 18, textAlign: "center" }}>
            {episodeDetails.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontWeight: "600", paddingRight: 10 }}>Air Date:</Text>
            <Text>{episodeDetails.airDate.formatted}</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            backgroundColor: colors.background,
          }}
        >
          <Text style={{ fontSize: 16 }}>{episodeDetails.overview}</Text>
        </View>

        <View style={styles.castInfo}>
          {episodeDetails?.cast &&
            episodeDetails.cast.map((person, idx) => (
              <TouchableOpacity
                key={person.personId + idx.toString()}
                onPress={() => {
                  //NEED TO FIX THIS
                  navigation.push(`${route.name}Person`, {
                    personId: person.personId,
                    // fromRouteName: route.name,
                    fromRouteName: "MODAL",
                  });
                }}
              >
                <DetailCastInfo person={person} screenWidth={width} key={person.personId} />
              </TouchableOpacity>
            ))}
          {episodeDetails?.guestStars &&
            episodeDetails.guestStars.map((person, idx) => (
              <TouchableOpacity
                key={person.personId + idx.toString()}
                onPress={() => {
                  //NEED TO FIX THIS
                  navigation.push(`${route.name}Person`, {
                    personId: person.personId,
                    fromRouteName: "MODAL",
                  });
                }}
              >
                <DetailCastInfo person={person} screenWidth={width} key={person.personId} />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.commonBorder,
    backgroundColor: colors.background,
    // marginHorizontal: 5,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: colors.darkbg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
  castInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
});

export default EpisodeScreen;
