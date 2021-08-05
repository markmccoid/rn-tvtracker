import { TVShowSeasonDetails, Episode } from "@markmccoid/tmdb_api";
import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Alert,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import { useOActions, useOState } from "../../store/overmind";

import { EyeEmptyIcon, EyeFilledIcon } from "../common/Icons";

type Props = {
  tvShowId: number;
  episode: Episode;
};
const { width, height } = Dimensions.get("window");

const DetailSeasonEpisode = ({ tvShowId, episode }: Props) => {
  const state = useOState();
  const actions = useOActions();
  const { toggleTVShowEpisodeState } = actions.oSaved;
  // const episode = state.oSaved.getTVShowEpisode(tvShowId, seasonNumber, episodeNumber);
  // const [episodeState, setEpisodeState] = React.useState(false);
  const [askToMark, setAskToMark] = React.useState(false);
  const episodeState = state.oSaved.getTVShowEpisodeState(
    tvShowId,
    episode.seasonNumber,
    episode.episodeNumber
  );
  // const episodeState = state.oSaved.getTVShowEpisodeState(tvShowId,seasonNumber, episodeNumber);
  // React.useEffect(() => {
  //   setEpisodeState(state.oSaved.getTVShowEpisodeState(tvShowId, seasonNumber, episodeNumber));
  // }, []);

  // Was trying to use the episodeState to control the UI changes, but then when I added
  // the functionality to update episode state (mark all previous as watched) the UI
  // wouldn't be updated until coming back in.  THUS, this use effect was born.
  // Should be a better way, but for now, this is it.
  React.useEffect(() => {
    if (askToMark) {
      Alert.alert("Mark Previous", "Mark all previous?", [
        {
          text: "Ok",
          onPress: () =>
            actions.oSaved.markAllPreviousEpisodes({
              tvShowId,
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            }),
        },
        { text: "Cancel" },
      ]);
      setAskToMark(false);
    }
  }, [askToMark]);

  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#e0a52577",
        marginBottom: 5,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ justifyContent: "center", paddingRight: 15 }}>
          <Text style={styles.epNumber}>{`${episode.episodeNumber}`}</Text>
        </View>
        <View style={{ flexDirection: "column", overflow: "hidden", width: width / 1.5 }}>
          <Text style={styles.epName}>{episode.name}</Text>
          <Text>{`${episode.airDate?.formatted || "Unknown"}`}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center", padding: 10 }}
        activeOpacity={0.75}
        onPress={async () => {
          // setEpisodeState((prev) => !prev);
          setAskToMark(
            await toggleTVShowEpisodeState({
              tvShowId,
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            })
          );
        }}
      >
        {episodeState ? (
          <EyeFilledIcon color={"green"} size={25} />
        ) : (
          <EyeEmptyIcon size={25} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  epNumber: {
    fontSize: 18,
    fontWeight: "600",
  },
  epName: {
    fontSize: 16,
    fontWeight: "600",
  },
});
export default React.memo(DetailSeasonEpisode);
