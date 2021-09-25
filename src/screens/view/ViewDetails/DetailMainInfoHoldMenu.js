import React, { useState } from "react";
import { View, Alert, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { HoldItem } from "react-native-hold-menu";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { nativeShareItem } from "../../../utils/nativeShareItem";
import {
  scheduleLocalNotification,
  sendNotificationImmediately,
} from "../../../utils/notificationHelpers";

const showRefreshAlert = (msg) => {
  Alert.alert("TV Show Refresh", msg);
};

// const sendNotificationImmediately = async (tvShowName, tvShowId) => {
//   await scheduleLocalNotification(
//     `${tvShowName}-${tvShowId}`,
//     `New Episode for ${tvShowName}`,
//     tvShowId,
//     new Date(),
//     22
//   );
//   // const url = Linking.createURL(`/details/${tvShowId}`);
//   // let notificationId = await Notifications.scheduleNotificationAsync({
//   //   content: {
//   //     title: `${tvShowName}-${tvShowId}`,
//   //     body: `New Episode for ${tvShowName}`,
//   //     data: { url },
//   //   },
//   //   trigger: {
//   //     seconds: 5,
//   //   },
//   // });

//   //console.log(notificationId); // can be saved in AsyncStorage or send to server
// };

const DetailMainInfoHoldMenu = ({
  tvShow,
  navigateToRoute,
  routeName,
  isInSavedTVShows,
  refreshTVShow,
  children,
}) => {
  const [isRefreshing, setisRefreshing] = useState(false);
  const navigation = useNavigation();
  const onPressShare = () => {
    nativeShareItem({
      message: `Open & Search in TV Tracker -> \n${Linking.createURL(
        `/search/${tvShow.name}`
      )}\n Or view in IMDB\n`, //`${movie.title}\n`,
      url: tvShow.imdbURL ? tvShow.imdbURL : tvShow.posterURL,
    });
  };
  //-----------------------------------
  //-- COMMENTED OUT UNTIL HOLD MENU BUG IS FIXED
  // Setup hold-menu items for use in the hold menu
  const menuItemTitle = { text: "Actions", icon: "home", isTitle: true, onPress: () => {} };
  const menuItemUpdateMovie = {
    text: `Update TV Show`,
    onPress: async () => {
      let msg = await refreshTVShow({ tvShowId: tvShow.id });
      showRefreshAlert(msg);
      navigateToRoute();
    },
  };
  const menuItemShareMovie = {
    text: "Share TV Show",
    withSeperator: false,
    icon: "share",
    onPress: onPressShare,
  };
  const menuItemPickImage = {
    text: "Change Image",
    withSeperator: true,
    onPress: async () => {
      navigation.navigate(`${routeName}PickImage`, { tvShowId: tvShow.id });
    },
  };

  const sendNotification = {
    text: "Send test Notification",
    withSeperator: false,
    onPress: () => sendNotificationImmediately(tvShow.id),
  };
  return (
    <HoldItem
      items={[
        menuItemTitle,
        isInSavedTVShows ? menuItemUpdateMovie : undefined,
        isInSavedTVShows ? menuItemPickImage : undefined,
        menuItemShareMovie,
      ].filter((el) => el)}
    >
      {children}
    </HoldItem>
  );
  //--------------------------------------

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={
        isInSavedTVShows || !isRefreshing
          ? async () => {
              setisRefreshing(true);
              await refreshTVShow(tvShow.id);
              const msg = `${tvShow.name} has been updated.`;
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
                message: `Open & Search in TV Tracker -> \n${Linking.createURL(
                  `/search/${tvShow.name}`
                )}\n Or view in IMDB\n`, //`${movie.title}\n`,
                url: tvShow.imdbURL ? tvShow.imdbURL : tvShow.posterURL,
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
