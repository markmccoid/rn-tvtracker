import React from "react";
import { View, Text, Dimensions, Image, StyleSheet } from "react-native";
import styled from "styled-components";
import PosterImage from "../../../components/common/PosterImage";

const width = Dimensions.get("window").width;
const IMAGE_PADDING = 10;
const IMAGES_ON_SCREEN = 3;
const imageWidth = width / IMAGES_ON_SCREEN - IMAGE_PADDING * 2;
const imageHeight = (width / IMAGES_ON_SCREEN - IMAGE_PADDING * 2) * 1.5;

const Character = styled.Text`
  font-size: 18px;
  text-align: center;
`;
const Actor = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
`;

const DetailCastInfo = ({ person, screenWidth }) => {
  const { name, characterName, profileURL } = person;

  return (
    <View style={styles.container}>
      <PosterImage
        uri={profileURL}
        style={styles.castPicture}
        posterWidth={imageWidth}
        posterHeight={imageHeight}
      />
      <Actor>{name}</Actor>
      <Character>{characterName}</Character>
    </View>
  );
};
// profile image is a 6 x 9 ratio
const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: IMAGE_PADDING,
    width: width / IMAGES_ON_SCREEN,
    alignItems: "center",
  },
  castPicture: {
    width: imageWidth, //width / 2 - 20,
    height: imageHeight, //(width / 2 - 20) * 1.5,
    borderRadius: imageWidth,
    backgroundColor: "gray",
    borderColor: "black",
    borderWidth: 1,
  },
});

export default DetailCastInfo;
