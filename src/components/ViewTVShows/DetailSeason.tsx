import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";
import React, { ComponentProps, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";
import { useOState } from "../../store/overmind";

import DetailSeasonEpisode from "./DetailSeasonEpisode";
import { useCallback } from "react";
import HiddenContainer from "../HiddenContainer/HiddenContainer";

function useLayout() {
  const [layout, setLayout] = useState({
    height: 0,
  });
  const onLayout: ComponentProps<typeof View>["onLayout"] = ({ nativeEvent }) => {
    console.log(nativeEvent.layout);
    setLayout(nativeEvent.layout);
  };

  return [layout, onLayout] as const;
}

type Props = {
  tvShowId: number;
  // season: TVShowSeasonDetails;
  seasonName: string;
  seasonNumber: number;
  seasonState: boolean;
  toggleSeasonState: () => void;
};

const DetailSeason = ({
  tvShowId,
  seasonName,
  seasonNumber,
  seasonState,
  toggleSeasonState,
}: Props) => {
  const state = useOState();
  const episodes = state.oSaved.getTVShowEpisodes(tvShowId, seasonNumber);
  // const [{ height }, onLayout] = useLayout();
  const seasonTitle =
    seasonName === `Season ${seasonNumber}` || seasonNumber === 0
      ? seasonName
      : `Season ${seasonNumber} - ${seasonName}`;

  // console.log("Season Render", tvShowId, seasonNumber);
  const EpisodeList = () => (
    <>
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
    </>
  );

  return (
    <View key={seasonNumber}>
      <TouchableOpacity onPress={toggleSeasonState}>
        <View style={styles.seasonName}>
          <Text style={styles.seasonText}>{seasonTitle}</Text>
        </View>
      </TouchableOpacity>

      <View style={{ marginHorizontal: 5 }}>
        {seasonState &&
          episodes.map((ep) => {
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
