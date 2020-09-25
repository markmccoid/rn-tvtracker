import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Button, CircleButton } from "../../../components/common/Buttons";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";

const DetailMainInfo = ({ movie }) => {
  const { width, height } = useDimensions().window;
  // If poster doesn't exist use the placeholder image
  let movieURL = movie.posterURL
    ? { uri: movie.posterURL }
    : require("./placeholder.png");
  // Get data to use from movie object
  const { overview = "", releaseDate = "", imdbURL = "", runtime = "" } = movie;
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: width,
          paddingTop: 5,
          paddingBottom: 15,
          // backgroundColor: "#3b544199",
        }}
      >
        <View style={[styles.posterWrapper, styles.posterImage]}>
          <Image
            style={styles.posterImage}
            source={movieURL}
            resizeMode="contain"
          />
        </View>
        <View style={{ width: width - 145, paddingLeft: 5 }}>
          <Text style={{ fontSize: 18 }}>{overview}</Text>
        </View>
      </View>
      <View>
        <View style={styles.textRow}>
          <Text style={styles.textRowLabel}>Released:</Text>
          <Text style={{ fontSize: 18 }}>{releaseDate.formatted}</Text>
        </View>
        {runtime ? (
          <View style={styles.textRow}>
            <Text style={styles.textRowLabel}>Length: </Text>
            <Text style={{ fontSize: 18 }}>{runtime} minutes</Text>
          </View>
        ) : null}
        <View style={[styles.textRow, { flexWrap: "wrap" }]}>
          <Text style={styles.textRowLabel}>Genre(s): </Text>
          {movie.genres.map((genre, idx) => (
            <Text key={genre} style={{ fontSize: 18 }}>{`${
              idx === 0 ? "" : ", "
            }${genre}`}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  posterWrapper: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 2.5, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
    // marginLeft: 5,
    marginRight: 5,
    // marginTop: 10,
  },
  posterImage: {
    width: 130,
    height: 200,
  },
  textRow: {
    flexDirection: "row",
  },
  textRowLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});
export default DetailMainInfo;
