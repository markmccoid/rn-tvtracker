import { TVShowSeasonDetails, Episode } from "@markmccoid/tmdb_api";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/core";

import * as Linking from "expo-linking";

import { useOActions, useOState } from "../../store/overmind";

import { IMDBIcon, EyeFilledIcon, ViewTVShowIcon } from "../common/Icons";
import { fonts, colors, seasonConstants } from "../../globalStyles";

//@types
import { SectionListDataItem } from "../../screens/view/ViewDetails/SeasonScreen";
// import { reduceRight } from "lodash";

type Props = {
  tvShowId: number;
  episode: SectionListDataItem;
  episodeState: boolean;
  episodeDownloadState: boolean;
  isShowSaved: boolean;
};
const { width, height } = Dimensions.get("window");

const DetailSeasonEpisode = ({
  tvShowId,
  episode,
  episodeState,
  episodeDownloadState,
  isShowSaved,
}: Props) => {
  const state = useOState();
  const actions = useOActions();
  const { isDownloadStateEnabled } = state.oSaved.settings;
  const { toggleTVShowEpisodeState, getEpisodeExternalIds } = actions.oSaved;
  // const episode = state.oSaved.getTVShowEpisode(tvShowId, seasonNumber, episodeNumber);
  // const [episodeState, setEpisodeState] = React.useState(false);
  const [askToMark, setAskToMark] = React.useState(false);

  // this ref is set whenever episode or download state change is made
  // it is then checked in the useEffect
  const isDownloadStateUpdate = React.useRef(false);
  // only consider download state usable if the "isDownloadStateEnable" setting is true
  const downloadStateActive = isDownloadStateEnabled && episodeDownloadState;

  const navigation = useNavigation();
  const route = useRoute();

  const episodeNumberText = (
    <Text
      style={[styles.epNumberText, , downloadStateActive && styles.epNumberTextActive]}
    >{`${episode.episodeNumber}`}</Text>
  );
  const episodeNumberView =
    isShowSaved && isDownloadStateEnabled ? (
      <TouchableOpacity
        style={[styles.epNumberView, downloadStateActive && styles.epNumberTouch]}
        onPress={async () => {
          isDownloadStateUpdate.current = true;
          const toggleResult = await toggleTVShowEpisodeState({
            tvShowId,
            seasonNumber: episode.seasonNumber,
            episodeNumber: episode.episodeNumber,
            modifyDownloadState: true,
          });
          // Update useEffect to work for both downloads and watched
          // console.log("use setAskToMark(result)", toggleResult);
          setAskToMark(toggleResult);
        }}
      >
        {episodeNumberText}
      </TouchableOpacity>
    ) : (
      <View style={styles.epNumberView}>{episodeNumberText}</View>
    );
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
              modifyDownloadState: isDownloadStateUpdate.current,
            }),
        },
        { text: "Cancel" },
      ]);
      setAskToMark(false);
    }
  }, [askToMark]);

  // console.log("episode render", episode.seasonNumber, episode.episodeNumber);
  // console.log("route", `${route.name}Episode`);
  return (
    <View style={styles.episodeContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          // padding: 10,
          flex: 1,
        }}
      >
        {episodeNumberView}
        {/* Episode Name and Airdate info  */}
        <TouchableOpacity
          style={{ flex: 1, marginVertical: 3, paddingRight: 4 }}
          onPress={() =>
            navigation.navigate(`${route.name}Episode`, {
              tvShowId: tvShowId,
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            })
          }
        >
          <View
            style={{
              flexDirection: "column",
              marginRight: 4,
              // width: width / 1.5,
            }}
          >
            <Text style={styles.epName} numberOfLines={1}>
              {episode.name}
            </Text>
            <Text allowFontScaling={false}>{`${episode.airDate || "Unknown"}`}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={async () => {
            const { imdbId } = await getEpisodeExternalIds({
              tvShowId,
              seasonNumber: episode.seasonNumber,
              episodeNumber: episode.episodeNumber,
            });

            if (imdbId === null) {
              return null;
            }
            Linking.openURL(`imdb:///title/${imdbId}`).catch((err) => {
              Linking.openURL(
                "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
              );
            });
          }}
        >
          <View
            style={{
              // backgroundColor: colors.imdbYellow,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#f6c418",
              marginRight: 10,
              width: 27,
            }}
          >
            <View
              style={{
                position: "absolute",
                backgroundColor: "black",
                width: 22,
                height: 20,
                top: 2,
              }}
            />
            <IMDBIcon size={25} color="#f6c418" />
          </View>
        </TouchableOpacity>

        {isShowSaved && (
          <TouchableOpacity
            style={{ justifyContent: "center", padding: 10 }}
            activeOpacity={0.75}
            onPress={async () => {
              isDownloadStateUpdate.current = false;
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
    </View>
  );
};

const styles = StyleSheet.create({
  episodeContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.commonBorder,
    // borderRadius: 5,
    backgroundColor: "#E0E7EB",
    // marginBottom: 5,
    marginLeft: 10,
    paddingRight: 5,
    width: width - 10,
    justifyContent: "space-around",
    height: seasonConstants.episodeHeight,
  },
  epNumberText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: fonts.family.episodes,
  },
  epNumberTextActive: {
    color: "#D7EBDB",
  },
  epNumberView: {
    justifyContent: "center",
    marginRight: 6,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  epNumberTouch: {
    backgroundColor: "#274315",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: "50%",
  },
  epName: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fonts.family.episodes,
  },
});
export default DetailSeasonEpisode;
