import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MotiView } from "moti";
import { useOState } from "../../store/overmind";

import DetailSeasonEpisode from "./DetailSeasonEpisode";

type Props = {
  tvShowId: number;
  // season: TVShowSeasonDetails;
  seasonName: string;
  seasonNumber: number;
};

const DetailSeason = ({ tvShowId, seasonName, seasonNumber }: Props) => {
  const state = useOState();
  const episodes = state.oSaved.getTVShowEpisodes(tvShowId, seasonNumber);

  const seasonTitle =
    seasonName === `Season ${seasonNumber}` || seasonNumber === 0
      ? seasonName
      : `Season ${seasonNumber} - ${seasonName}`;

  // console.log("Season Render", tvShowId, seasonNumber);
  return (
    <View key={seasonNumber}>
      <View style={styles.seasonName}>
        <Text style={styles.seasonText}>{seasonTitle}</Text>
      </View>
      <View style={{ flexDirection: "column", marginHorizontal: 5 }}>
        {episodes.map((ep) => {
          const episodeState = state.oSaved.getTVShowEpisodeState(
            tvShowId,
            ep.seasonNumber,
            ep.episodeNumber
          );
          return (
            <DetailSeasonEpisode
              key={`${ep.seasonNumber}-${ep.episodeNumber}`}
              episode={ep}
              episodeState={episodeState}
              // episodeNumber={ep.episodeNumber}
              // seasonNumber={ep.seasonNumber}
              tvShowId={tvShowId}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonName: {
    borderWidth: 1,
    borderColor: "#aaa123",
    padding: 5,
    marginBottom: 5,
    backgroundColor: "white",
  },
  seasonText: {
    fontSize: 18,
  },
});
export default React.memo(DetailSeason);
