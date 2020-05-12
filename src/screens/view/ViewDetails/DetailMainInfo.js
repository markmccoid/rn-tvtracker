import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import CachedImage from "react-native-expo-cached-image";
import { Button, CircleButton } from "../../../components/common/Buttons";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";

const DetailMainInfo = ({ movie }) => {
  const { width, height } = useDimensions().window;
  const dims = useDimensions();
  // Set the title to the current movie title
  console.log("MOVIEDATA", movie);
  let movieURL = movie.posterURL || movie.backdropURL;
  return (
    <View>
      {/* <Image
        style={{
          width,
          height: 200,
        }}
        resizeMode="cover"
        source={{
          uri: movie.backdropURL,
        }}
      /> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: width,
          //backgroundColor: "#3b544199",
        }}
      >
        <Image
          style={{ width: 130, height: 200, marginRight: 10 }}
          source={{ uri: movie.posterURL }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 16, width: width - 145, paddingTop: 10 }}>
          {movie.overview}
        </Text>
      </View>
      <View
        style={{
          margin: 5,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>{movie.releaseDate.formatted}</Text>
      </View>
    </View>
  );
};

export default DetailMainInfo;
