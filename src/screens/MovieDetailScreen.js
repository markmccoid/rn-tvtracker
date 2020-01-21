import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigationParam } from "react-navigation-hooks";

const MovieDetailScreen = ({ navigation }) => {
  const movie = useNavigationParam("movie");
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Text>{movie.overview}</Text>
      <View style={{ alignItems: "center" }}>
        <Image source={{ url: movie.backdropURL }} style={styles.image} />
      </View>
    </View>
  );
};

MovieDetailScreen.navigationOptions = ({ navigation }) => {
  let movie = navigation.getParam("movie");

  return {
    title: movie.title,
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate("MovieDetailTagEdit", { movie })}
      >
        <Feather name="tag" size={30} style={{ marginRight: 10 }} />
      </TouchableOpacity>
    )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    margin: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  image: {
    width: 300,
    height: 169,
    borderColor: "black",
    borderWidth: 1
  }
});

export default MovieDetailScreen;
