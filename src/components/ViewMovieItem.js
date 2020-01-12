import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";

const ViewMovieItem = ({ movie }) => {
  const { navigate } = useNavigation();
  const { actions } = useOvermind();
  const { deleteMovie } = actions.oSaved;
  return (
    <TouchableOpacity onPress={() => navigate("MovieDetail", { movie })}>
      <View style={styles.container}>
        <Image source={{ url: movie.posterURL }} style={styles.image} />
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
    width: 190,
    flexDirection: "column",
    alignItems: "center",
    margin: 5
  },
  movieInfo: {
    width: 149,
    padding: 4,
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1
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
    borderWidth: 1
  }
});

export default ViewMovieItem;
