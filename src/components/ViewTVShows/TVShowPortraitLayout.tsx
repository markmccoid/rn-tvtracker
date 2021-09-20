import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";
import PosterImage from "../common/PosterImage";
import { colors, styleHelpers } from "../../globalStyles";
import { SavedTVShowsDoc } from "../../store/oSaved/state";
import { useOState } from "../../store/overmind";
import { MotiView } from "moti";
import PressableButton from "../common/PressableButton";
import { sendNotificationImmediately } from "../../utils/notificationHelpers";

type Props = {
  tvShow: SavedTVShowsDoc;
  setTVShowEditingId: (tvShowId: number) => void;
  navigateToDetails: () => void;
};

const setEpisodeGroupStyles = (group, maxWidth) => {
  //0 < 15, 1 < 30, 2 < 60, 3/undefined everything else
  switch (group) {
    case 0:
      return { backgroundColor: colors.episodeLengthGroup0, width: maxWidth / 4 };
    case 1:
      return {
        backgroundColor: colors.episodeLengthGroup1,
        width: maxWidth / 2.5,
        // alignSelf: "flex-start",
      };
    case 2:
      return {
        backgroundColor: colors.episodeLengthGroup2,
        width: maxWidth / 1.2,
      };
    default:
      return { backgroundColor: colors.episodeLengthGroup3, width: maxWidth / 1.5 };
  }
};
const TVShowPortraitLayout = ({ tvShow, setTVShowEditingId, navigateToDetails }: Props) => {
  const { width, height } = useDimensions().window;
  const state = useOState();
  const { getNotWatchedEpisodeCount } = state.oSaved;
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
  const countEpisodesNotWatched = getNotWatchedEpisodeCount(tvShow.id);
  const episodeGroupStyles = setEpisodeGroupStyles(tvShow.episodeRunTimeGroup, posterWidth);

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
    episodesLeftPosition: { position: "absolute", bottom: -5, zIndex: 10 },
    episodesLeftContainer: {
      backgroundColor:
        countEpisodesNotWatched === 0 ? colors.excludeRed : colors.buttonPrimary,
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
              <Text style={styles.episodesLeftText}>{countEpisodesNotWatched}</Text>
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
