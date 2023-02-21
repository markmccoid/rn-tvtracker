import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity } from "react-native-gesture-handler";
import PosterImage from "../common/PosterImage";
import { colors, styleHelpers } from "../../globalStyles";
import { SavedTVShowsDoc } from "../../store/oSaved/state";
import { useOState } from "../../store/overmind";
import { MotiView } from "moti";
import PressableButton from "../common/PressableButton";
import { sendNotificationImmediately } from "../../utils/notificationHelpers";
import { getEpisodeRunTimeGroup } from "../../utils/helperFunctions";
import { color } from "react-native-reanimated";

type Props = {
  tvShow: SavedTVShowsDoc;
  setTVShowEditingId: (tvShowId: number) => void;
  navigateToDetails: () => void;
};

const setEpisodeGroupStyles = (
  group: number,
  maxWidth: number
): [Object, number] => {
  //0 < 15, 1 < 30, 2 < 60, 3/undefined everything else
  switch (group) {
    case 0:
      return [
        { backgroundColor: colors.episodeLengthGroup0, width: maxWidth / 4 },
        maxWidth / 4,
      ];
    case 1:
      return [
        {
          backgroundColor: colors.episodeLengthGroup1,
          width: maxWidth / 2.5,
          // alignSelf: "flex-start",
        },
        maxWidth / 2.5,
      ];
    case 2:
      return [
        {
          backgroundColor: colors.episodeLengthGroup2,
          width: maxWidth / 1.2,
        },
        maxWidth / 1.2,
      ];
    default:
      return [
        { backgroundColor: colors.episodeLengthGroup3, width: maxWidth / 1.5 },
        maxWidth / 1.5,
      ];
  }
};
const TVShowPortraitLayout = ({
  tvShow,
  setTVShowEditingId,
  navigateToDetails,
}: Props) => {
  const { width, height } = useWindowDimensions();
  const state = useOState();
  const { getNotWatchedEpisodeCount } = state.oSaved;
  const { isDownloadStateEnabled, showNextAirDateEnabled } =
    state.oSaved.settings;

  const navigation = useNavigation();
  //! Should be first air date
  //const movieReleaseDate = tvShow.releaseDate?.formatted || " - ";

  // const menuItems = createMenuItems({ navigateToDetails, movieId: tvShow.id });
  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2.2;
  let posterHeight = posterWidth * 1.5;
  const MARGIN = 5;
  const BORDER_RADIUS = 10;
  const {
    countEpisodesNotWatched,
    countEpisodesNotDownloaded,
    downloadedEpisodes,
  } = getNotWatchedEpisodeCount(tvShow.id);

  const [episodeGroupStyles, groupWidthOffset] = setEpisodeGroupStyles(
    getEpisodeRunTimeGroup(tvShow.avgEpisodeRunTime),
    posterWidth
  );

  //--------------------------------
  //-- create an object for the colors used for status/next air date box
  const statusColors = {
    Ended: colors.ended,
    ["Returning Series"]: colors.returning,
    Canceled: colors.canceled,
    nextAirDate: colors.nextAirDate,
  };
  const tvShowStatus =
    tvShow?.status === "Returning Series" && tvShow?.nextAirDate
      ? "nextAirDate"
      : tvShow?.status;
  const statusColor = statusColors[tvShowStatus];

  //--------------------------------
  const styles = StyleSheet.create({
    movieCard: {
      // backgroundColor: colors.background,
      margin: MARGIN,
      width: posterWidth,
      borderWidth: 1,
      borderRadius: BORDER_RADIUS,
      borderColor: "#ddd",
      borderBottomWidth: 0,
      shadowColor: "#000",
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 1,
      alignItems: "center",
    },

    imageBackupText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
    },
    episodesLeftPosition: {
      position: "absolute",
      bottom: -5,
      zIndex: 10,
      // flexDirection: "row",
    },
    episodesLeftContainer: {
      backgroundColor:
        countEpisodesNotWatched === 0
          ? colors.excludeRed
          : colors.buttonPrimary,
      paddingVertical: 4,
      paddingHorizontal: 6,
      borderTopLeftRadius: 8,
      borderTopRightRadius: 8,
      borderRadius: 6,
      borderWidth: 1,
    },
    episodesLeftText: {
      color: countEpisodesNotWatched === 0 ? "white" : "black",
    },
  });

  return (
    <View style={styles.movieCard}>
      <View
        style={{
          marginLeft: groupWidthOffset - posterWidth,
          ...styleHelpers.buttonShadow,
          marginBottom: 3,
          height: 6,
          borderRadius: 3,
          ...episodeGroupStyles,
        }}
      />

      <TouchableOpacity
        onPress={navigateToDetails}
        activeOpacity={0.9}
        onLongPress={() => {
          navigation.navigate("ViewStackSeasons", {
            tvShowId: tvShow.id,
            logo: { showName: tvShow.name },
          });
          // setTVShowEditingId(tvShow.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View style={{ alignItems: "center" }}>
          <React.Fragment>
            {showNextAirDateEnabled && (
              <View
                style={{ position: "absolute", zIndex: 10, top: -5, left: 5 }}
              >
                <View
                  style={{
                    backgroundColor: `${statusColor}cc`, //"#ffffffaa",
                    borderWidth: StyleSheet.hairlineWidth,
                    padding: 4,
                    borderTopRightRadius: 4,
                    borderTopLeftRadius: 4,
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 3,
                      height: 3,
                    },
                    shadowOpacity: 0.85,
                    shadowRadius: 3,
                    elevation: 5,
                    //       ...styleHelpers.buttonShadow,
                    // display: tvShow?.nextAirDate?.formatted ? undefined : "none",
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {tvShow?.nextAirDate?.formatted || tvShow?.status}
                  </Text>
                </View>
              </View>
            )}
            {/* Downloadable Episodes Left display */}
            {isDownloadStateEnabled && downloadedEpisodes > 0 && (
              <View
                style={{ position: "absolute", zIndex: 10, top: -5, right: 5 }}
              >
                <PressableButton
                  style={[
                    styles.episodesLeftContainer,
                    {
                      backgroundColor: colors.darkText,
                      borderRadius: 50,
                      borderWidth: StyleSheet.hairlineWidth,
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 2,
                        height: 2,
                      },
                      shadowOpacity: 0.85,
                      shadowRadius: 3.75,
                      elevation: 5,
                    },
                  ]}
                  onPress={() => {
                    // console.log("sending notification", tvShow.id);
                    // sendNotificationImmediately(tvShow.id);
                    navigation.navigate("ViewStackSeasons", {
                      tvShowId: tvShow.id,
                      logo: { showName: tvShow.name },
                    });
                  }}
                >
                  <Text style={[styles.episodesLeftText, { color: "white" }]}>
                    {countEpisodesNotDownloaded}
                  </Text>
                </PressableButton>
              </View>
            )}
          </React.Fragment>

          <View style={styles.episodesLeftPosition}>
            <PressableButton
              style={styles.episodesLeftContainer}
              onPress={() => {
                // console.log("sending notification", tvShow.id);
                // sendNotificationImmediately(tvShow.id);
                navigation.navigate("ViewStackSeasons", {
                  tvShowId: tvShow.id,
                  logo: { showName: tvShow.name },
                });
              }}
            >
              <Text style={styles.episodesLeftText}>
                {countEpisodesNotWatched}
              </Text>
            </PressableButton>
          </View>
          <PosterImage
            uri={tvShow.posterURL}
            posterWidth={posterWidth}
            posterHeight={posterHeight}
            placeholderText={tvShow.name}
            style={{ borderRadius: BORDER_RADIUS }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TVShowPortraitLayout;
