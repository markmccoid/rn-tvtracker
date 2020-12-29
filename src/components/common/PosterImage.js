import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image } from "react-native-elements";

const PosterImage = ({ uri, placeholderText, posterWidth, posterHeight }) => {
  const posterURI = uri ? { uri } : {};
  return (
    <Image
      source={posterURI}
      style={styles.posterImage(posterWidth, posterHeight)}
      PlaceholderContent={<Text style={styles.imageBackupText}>{placeholderText}</Text>}
    />
  );
};

const styles = StyleSheet.create({
  posterImage: (width, height) => ({
    width,
    height,
  }),
  imageBackupText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default PosterImage;
