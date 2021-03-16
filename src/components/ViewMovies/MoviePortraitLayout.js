import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";
import PosterImage from "../common/PosterImage";
import { colors } from "../../globalStyles";

const MoviePortraitLayout = ({ movie, setMovieEditingId, navigateToDetails }) => {
  const { width, height } = useDimensions().window;
  const movieReleaseDate = movie.releaseDate?.formatted || " - ";

  // const menuItems = createMenuItems({ navigateToDetails, movieId: movie.id });
  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2.2;
  let posterHeight = posterWidth * 1.5;
  const MARGIN = 5;
  const BORDER_RADIUS = 10;

  const styles = StyleSheet.create({
    movieCard: {
      backgroundColor: colors.background,
      width: "100%",
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
      // shadowOffset: { width: 1, height: 2 },
      // shadowOpacity: 0.5,
      // shadowRadius: 3,
      elevation: 1,
    },
    imageBackupText: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  return (
    <View style={styles.movieCard}>
      <TouchableOpacity
        onPress={navigateToDetails}
        activeOpacity={0.9}
        onLongPress={() => {
          setMovieEditingId(movie.id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}
      >
        <View>
          <PosterImage
            uri={movie.posterURL}
            posterWidth={posterWidth}
            posterHeight={posterHeight}
            placeholderText={movie.title}
            style={{ borderRadius: BORDER_RADIUS }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MoviePortraitLayout;
