import React from "react";
import { StyleSheet, Animated, TouchableWithoutFeedback, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { Button } from "../../../components/common/Buttons";
import { colors } from "../../../globalStyles";
import { CaretRightIcon, ImagesIcon } from "../../../components/common/Icons";

const DetailButtonBar = ({
  viewPickImage,
  setPickImage,
  setvpiAnimation,
  transitionRef,
  imdbId,
  tvShowName,
  isInSavedTVShows,
}) => {
  // Animated Icons
  const iconAnim = React.useRef(new Animated.Value(0)).current;

  const Rotate = (toValue) => {
    Animated.timing(iconAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.buttonBar}>
      <Button
        onPress={() =>
          Linking.openURL(`imdb:///title/${imdbId}`).catch((err) => {
            Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
          })
        }
        title="Open in IMDB"
        bgOpacity="ff"
        bgColor={colors.primary}
        small
        // width={150}
        wrapperStyle={{ borderRadius: 10, paddingLeft: 15, paddingRight: 15 }}
        color="#fff"
        noBorder
      />
      <Button
        onPress={async () => {
          let webURL = `https://google.com/search?query=${tvShowName} tv show`;
          webURL = webURL.replace(/\s+/g, "%20");
          await WebBrowser.openBrowserAsync(webURL);
        }}
        title="Google It"
        bgOpacity="ff"
        bgColor={colors.primary}
        small
        // width={width / 3}
        wrapperStyle={{
          borderRadius: 10,
          paddingLeft: 15,
          paddingRight: 15,
        }}
        color="#fff"
        noBorder
      />
      {/* ONLY Show below if movie has been saved (Image Picker) */}
      {isInSavedTVShows && (
        <TouchableWithoutFeedback
          onPress={() => {
            Rotate(viewPickImage); //start icon animation
            if (transitionRef.current) {
              transitionRef.current.animateNextTransition();
            }
            viewPickImage === 1 ? setvpiAnimation("open") : setvpiAnimation("closing");
            setPickImage((prevValue) => (prevValue === 0 ? 1 : 0));
          }}
        >
          <View
            style={{
              borderRadius: 10,
              flexDirection: "row",
              padding: 5,
              backgroundColor: colors.primary,
              paddingHorizontal: 15,
              justifyContent: "center",
            }}
          >
            <Animated.View
              style={{
                marginLeft: 5,
                transform: [
                  {
                    rotate: iconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "90deg"],
                    }),
                  },

                  {
                    scale: iconAnim.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [1, 1.5, 2],
                    }),
                  },
                ],
              }}
            >
              <CaretRightIcon size={20} color="white" />
            </Animated.View>
            <ImagesIcon size={20} color="white" style={{ marginLeft: 20 }} />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default DetailButtonBar;

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: "#ffffff85",
  },
});
