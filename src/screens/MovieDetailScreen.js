import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Button
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigationParam } from "react-navigation-hooks";
import BackdropImageContainer from "../components/MovieDetails/BackdropImageContainer";

const MovieDetailScreen = ({ navigation }) => {
  // const [inImageSelect, setInImageSelect] = React.useState(false);
  // const { height, width } = Dimensions.get("window");
  const movie = useNavigationParam("movie");
  return (
    <View style={styles.container}>
      <BackdropImageContainer movie={movie} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text>{movie.overview}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    //margin: 5,
    //borderColor: "black",
    //borderWidth: 1,
    //paddingHorizontal: 5
  },
  textContainer: {
    margin: 5,
    paddingHorizontal: 5
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  }
});

export default MovieDetailScreen;
