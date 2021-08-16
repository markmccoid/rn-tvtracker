import { TVShowSeasonDetails } from "@markmccoid/tmdb_api";
import React, { ComponentProps, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AnimatePresence, MotiView } from "moti";
import { useOState } from "../../store/overmind";

import SeasonHeader from "./SeasonHeader";
import DetailSeasonEpisode from "./DetailSeasonEpisode";

//--For use with Moti to measure layout of view
//--It works until you use the layout.height in Moti.
function useLayout() {
  const [layout, setLayout] = useState({
    height: 0,
  });
  const onLayout: ComponentProps<typeof View>["onLayout"] = ({ nativeEvent }) => {
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
  const episodesWatched = state.oSaved.getWathedEpisodes(tvShowId, seasonNumber);
  const [{ height }, onLayout] = useLayout();
  const seasonTitle =
    seasonName === `Season ${seasonNumber}` || seasonNumber === 0
      ? seasonName
      : `Season ${seasonNumber} - ${seasonName}`;
  //! MAKE Header it's own component
  const headerDetail = {
    seasonTitle,
    seasonNumber,
    seasonState,
    numberOfEpisodes: episodes.length,
    episodesWatched,
    toggleSeasonState,
  };
  return (
    <View key={seasonNumber}>
      <SeasonHeader headerDetail={headerDetail} />

      <AnimatePresence>
        {seasonState && (
          <MotiView
            from={{ opacity: 0.7, translateX: -500 }}
            animate={{ opacity: 1, translateX: 0 }}
            exitTransition={{
              type: "timing",
              duration: 200,
            }}
            exit={{
              opacity: 0.6,
              translateX: -500,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 10,
              // duration: 200,
            }}
          >
            <View style={{ marginHorizontal: 5 }} onLayout={onLayout}>
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
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa123",
    // padding: 5,
    marginBottom: 5,
    backgroundColor: "white",
  },
  seasonText: {
    fontSize: 18,
    padding: 5,
  },
});
export default DetailSeason;
