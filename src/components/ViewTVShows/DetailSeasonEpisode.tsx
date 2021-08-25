import { TVShowSeasonDetails, Episode } from "@markmccoid/tmdb_api";
import { AnimatePresence, MotiView } from "moti";
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

import { EyeFilledIcon, ViewTVShowIcon } from "../common/Icons";
import { fonts, colors } from "../../globalStyles";

//@types
import { SectionListDataItem } from "../../screens/view/ViewDetails/SeasonScreen";

type Props = {
  tvShowId: number;
  episode: SectionListDataItem;
  episodeState: boolean;
  isShowSaved: boolean;
};
const { width, height } = Dimensions.get("window");

const DetailSeasonEpisode = ({ tvShowId, episode, episodeState, isShowSaved }: Props) => {
  const state = useOState();
  const actions = useOActions();
  const { toggleTVShowEpisodeState } = actions.oSaved;
  // const episode = state.oSaved.getTVShowEpisode(tvShowId, seasonNumber, episodeNumber);
  // const [episodeState, setEpisodeState] = React.useState(false);
  const [askToMark, setAskToMark] = React.useState(false);

  // Was trying to use the episodeState to control the UI changes, but then when I added
  // the functionality to update episode state (mark all previous as watched) the UI
  // wouldn't be updated until coming back in.  THUS, this use effect was born.
  // Should be a better way, but for now, this is it
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

  // console.log("episode render", episode.seasonNumber, episode.episodeNumber);
  return (
    <View style={styles.episodeContainer}>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ justifyContent: "center", paddingRight: 15 }}>
          <Text style={styles.epNumber}>{`${episode.episodeNumber}`}</Text>
        </View>
        <View style={{ flexDirection: "column", overflow: "hidden", width: width / 1.5 }}>
          <Text style={styles.epName}>{episode.name}</Text>
          <Text>{`${episode.airDate || "Unknown"}`}</Text>
        </View>
      </View>

      {isShowSaved && (
        <TouchableOpacity
          style={{ justifyContent: "center", padding: 10 }}
          activeOpacity={0.75}
          onPress={async () => {
            const toggleResult = await toggleTVShowEpisodeState({
              tvShowId,
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            });
            setAskToMark(toggleResult);
          }}
        >
          {episodeState ? (
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ position: "absolute", bottom: 3.5 }}>
                <EyeFilledIcon
                  color={"green"}
                  size={15}
                  // style={{ position: "absolute", bottom: 3.5 }}
                />
              </View>
              <ViewTVShowIcon color={"green"} size={25} />
            </View>
          ) : (
            <ViewTVShowIcon size={25} color={"gray"} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  episodeContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.commonBorder,
    // borderRadius: 5,
    backgroundColor: "#E0E7EB",
    // marginBottom: 5,
    marginLeft: 10,
    justifyContent: "space-between",
    height: 55,
  },
  epNumber: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: fonts.family.episodes,
  },
  epName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fonts.family.episodes,
  },
});
export default DetailSeasonEpisode;
