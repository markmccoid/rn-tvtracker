import React, { useState } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { HoldItem } from "react-native-hold-menu";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

import { nativeShareItem } from "../../../utils/nativeShareItem";

const showRefreshAlert = (msg) => {
  Alert.alert("Movie Refresh", msg);
};

const DetailMainInfoHoldMenu = ({
  movie,
  navigateToRoute,
  isInSavedMovies,
  refreshMovie,
  children,
}) => {
  const [isRefreshing, setisRefreshing] = useState(false);
  // //-----------------------------------
  // //-- COMMENTED OUT UNTIL HOLD MENU BUG IS FIXED
  // // Setup hold-menu items for use in the hold menu
  // const menuItemTitle = { text: "Actions", icon: "home", isTitle: true, onPress: () => {} };
  // const menuItemUpdateMovie = {
  //   text: `Update Movie-${movie.id}`,
  //   onPress: async () => {
  //     let msg = await refreshMovie(movie.id);
  //     showRefreshAlert(msg);
  //     navigateToRoute();
  //   },
  // };
  // const menuItemShareMovie = {
  //   text: "Share Movie",
  //   withSeperator: false,
  //   icon: () => <ShareIcon size={20} />,
  //   onPress: () => {
  //     nativeShareItem({
  //       message: `Open & Search in Movie Tracker -> \n${Linking.createURL(
  //         `/search/${movie.title}`
  //       )}\n Or view in IMDB\n`, //`${movie.title}\n`,
  //       url: movie.imdbURL ? movie.imdbURL : movie.posterURL,
  //     });
  //   },
  // };
  // return (
  //   <HoldItem
  //     items={[
  //       menuItemTitle,
  //       isInSavedMovies ? menuItemUpdateMovie : undefined,
  //       menuItemShareMovie,
  //     ].filter((el) => el)}
  //   >
  //     {children}
  //   </HoldItem>
  // );
  //--------------------------------------

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={
        isInSavedMovies || !isRefreshing
          ? async () => {
              setisRefreshing(true);
              let msg = await refreshMovie(movie.id);
              setisRefreshing(false);
              showRefreshAlert(msg);
              navigateToRoute();
            }
          : null
      }
      onLongPress={
        !isRefreshing
          ? () => {
              nativeShareItem({
                message: `Open & Search in Movie Tracker -> \n${Linking.createURL(
                  `/search/${movie.title}`
                )}\n Or view in IMDB\n`, //`${movie.title}\n`,
                url: movie.imdbURL ? movie.imdbURL : movie.posterURL,
              });
            }
          : null
      }
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isRefreshing && (
          <>
            <LinearGradient
              // Button Linear Gradient
              colors={["#ccc", "#505d68", "#424b61"]}
              // colors={["#4c669f", "#3b5998", "#192f6a"]}
              style={styles.gradientStyle}
            ></LinearGradient>
            <ActivityIndicator size="large" style={styles.activityIndicator} />
          </>
        )}
        {children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  gradientStyle: {
    position: "absolute",
    borderRadius: 5,
    opacity: 0.51,
    zIndex: 100,
    width: "100%",
    height: "100%",
  },
  activityIndicator: {
    zIndex: 100,
    position: "absolute",
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
  },
});

export default DetailMainInfoHoldMenu;
