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

type Props = {
  episode: Episode;
  onSetTVShowEpisode: (episodeNumber: number) => void;
};
const DetailSeasonEpisode = ({ episode, onSetTVShowEpisode }: Props) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flexDirection: "column", borderWidth: 1, borderRadius: 5, padding: 10 }}>
        <Text>{`${episode.episodeNumber}-${episode.name}`}</Text>
        <Text>{`${episode.airDate.formatted}`}</Text>
      </View>
      <TouchableOpacity onPress={() => onSetTVShowEpisode(episode.episodeNumber)}>
        <Text>WATCH</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailSeasonEpisode;
