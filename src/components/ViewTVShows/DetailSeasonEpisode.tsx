import { TVShowSeasonDetails, Episode } from "@markmccoid/tmdb_api";
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
import { useOActions, useOState } from "../../store/overmind";

import { EyeEmptyIcon, EyeFilledIcon } from "../../components/common/Icons";

//@types
import { TempSeasonDataEpisode } from "../../store/oSaved/state";

type Props = {
  tvShowId: number;
  seasonNumber: number;
  episodeNumber: number;
};
const DetailSeasonEpisode = ({ tvShowId, seasonNumber, episodeNumber }: Props) => {
  const state = useOState();
  const actions = useOActions();
  const { toggleTVShowEpisodeState } = actions.oSaved;
  const episode = state.oSaved.getTVShowEpisode(tvShowId, seasonNumber, episodeNumber);
  const [episodeState, setEpisodeState] = React.useState(false);
  // const episodeState = state.oSaved.getTVShowEpisodeState(tvShowId,seasonNumber, episodeNumber);
  React.useEffect(() => {
    setEpisodeState(state.oSaved.getTVShowEpisodeState(tvShowId, seasonNumber, episodeNumber));
  }, []);

  // console.log("Render DetailSeasonEpisode", episode.episodeNumber, episode.name, episodeState);

  return (
    <View
      style={{
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 5,
        // padding: 10,
        marginBottom: 5,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ justifyContent: "center", paddingRight: 15 }}>
          <Text style={styles.epNumber}>{`${episode.episodeNumber}`}</Text>
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.epName}>{episode.name}</Text>
          <Text>{`${episode.airDate.formatted}`}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center", padding: 10 }}
        activeOpacity={0.75}
        onPress={() => {
          setEpisodeState((prev) => !prev);
          toggleTVShowEpisodeState({
            tvShowId,
            seasonNumber,
            episodeNumber: episode.episodeNumber,
          });
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
export default DetailSeasonEpisode;
