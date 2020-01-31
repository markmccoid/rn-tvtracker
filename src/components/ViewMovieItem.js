import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";

const ViewMovieItem = ({ movie }) => {
  const { navigate } = useNavigation();
  const { actions } = useOvermind();
  const { deleteMovie } = actions.oSaved;
  return (
    <TouchableOpacity onPress={() => navigate("MovieDetail", { movie })}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <EvilIcons name="heart" size={20} /> */}
          <Image source={{ url: movie.posterURL }} style={styles.image} />
        </View>
        <View style={styles.movieInfo}>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>
        </View>
        <View>
          <Button onPress={() => deleteMovie(movie.id)} title="Delete" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 2 - 10,
    flexDirection: "column",
    elevation: 1,
    borderRadius: 5,
    backgroundColor: "#eae7ea",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    //paddingRight: 10,
    marginTop: 10,
    marginBottom: 6,
    borderColor: "#555",
    borderWidth: 1
  },
  movieInfo: {
    padding: 4,
    alignItems: "center"
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold"
  },
  image: {
    width: 150,
    height: 225,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5
  }
});

export default ViewMovieItem;
