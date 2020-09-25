import React from "react";
import { View, Text, Dimensions, Image, StyleSheet } from "react-native";
import styled from "styled-components";

const width = Dimensions.get("window").width;
const IMAGE_PADDING = 10;
const IMAGES_ON_SCREEN = 3;
const imageWidth = width / IMAGES_ON_SCREEN - IMAGE_PADDING * 2;
const imageHeight = (width / IMAGES_ON_SCREEN - IMAGE_PADDING * 2) * 1.5;

const Character = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;
const Actor = styled.Text`
  font-size: 18px;
`;

const DetailCastInfo = ({ person, screenWidth }) => {
  const { name, characterName, profileURL } = person;
  let imageSource;
  if (profileURL) {
    imageSource = { uri: profileURL };
  } else {
    imageSource = require("../../../../assets/personplaceholder.png");
  }
  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.castPicture} />
      <Character>{characterName}</Character>
      <Actor>{name}</Actor>
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
