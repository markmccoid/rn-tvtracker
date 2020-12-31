import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
// import { Image } from "react-native-elements";

const PosterImage = ({
  uri,
  placeholderText,
  posterWidth,
  posterHeight,
  fallbackStyle = { container: {}, text: {} },
}) => {
  if (uri) {
    return (
      <Image
        style={styles.posterImage(posterWidth, posterHeight)}
        source={{ uri }}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.posterImage(posterWidth, posterHeight),
        styles.fallbackContainer,
        fallbackStyle.container,
      ]}
    >
      <Text style={[styles.imageBackupText, fallbackStyle.text]}>{placeholderText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  posterImage: (width, height) => ({
    width,
    height,
  }),
  fallbackContainer: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#777",
  },
  imageBackupText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default PosterImage;
