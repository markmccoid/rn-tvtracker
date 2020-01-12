import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
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

MovieDetailScreen.navigationOptions = {
  title: "Movie Details"
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
