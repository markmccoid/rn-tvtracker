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

const { width, height } = Dimensions.get("window");
const MARGIN = 5;

const EpisodeScreen = ({ navigation, route }) => {
  console.log("Route parms, episodescreen", route.params);
  const { tvShowId, seasonNumber, episodeNumber } = route.params;
  const [episodeDetails, setEpisodeDetails] = React.useState<TVShowEpisodeDetails>();

  const state = useOState();
  const actions = useOActions();
  const { apiGetTVShowEpisodeDetails } = actions.oSaved;

  const getEpisodeDetails = async () => {
    const dets = await apiGetTVShowEpisodeDetails({ tvShowId, seasonNumber, episodeNumber });
    setEpisodeDetails(dets.data);
    console.log("episode", dets.data);
  };
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
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>{episodeDetails.name}</Text>
        <Text style={styles.headerText}>{`S${seasonNumber} E${episodeNumber}`}</Text>
      </View>
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        }}
      >
        <PosterImage
          uri={episodeDetails.stillURL}
          placeholderText="Still Image"
          posterWidth={stillWidth}
          posterHeight={stillHeight}
        />
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Text>{episodeDetails.overview}</Text>
          <Text>{episodeDetails.airDate.formatted}</Text>
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
                    fromRouteName: route.name,
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
    // marginHorizontal: 5,
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 15,
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
