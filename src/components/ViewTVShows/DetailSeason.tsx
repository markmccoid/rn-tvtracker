import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";
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

import DetailSeasonEpisode from "./DetailSeasonEpisode";

type Props = {
  tvShowId: number;
  season: TVShowSeasonDetails;
};
const DetailSeason = ({ tvShowId, season }: Props) => {
  // console.log("Render DetailSeasons", season.seasonNumber);
  const state = useOState();
  const episodes = state.oSaved.getTVShowEpisodes(tvShowId, season.seasonNumber);
  const seasonName =
    season.name === `Season ${season.seasonNumber}` || season.seasonNumber === 0
      ? season.name
      : `Season ${season.seasonNumber} - ${season.name}`;
  return (
    <View key={season.seasonNumber}>
      <View style={styles.seasonName}>
        <Text style={styles.seasonText}>{seasonName}</Text>
      </View>
      <View style={{ flexDirection: "column", marginHorizontal: 5 }}>
        {episodes.map((ep) => (
          <DetailSeasonEpisode
            key={ep.episodeNumber}
            episodeNumber={ep.episodeNumber}
            seasonNumber={ep.seasonNumber}
            tvShowId={tvShowId}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonName: {
    borderWidth: 1,
    borderColor: "#aaa123",
    padding: 5,
    marginVertical: 5,
  },
  seasonText: {
    fontSize: 18,
  },
});
export default DetailSeason;
