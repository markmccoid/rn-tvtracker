import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button } from "../../../components/common/Buttons";
import { AddIcon, DeleteIcon } from "../../../components/common/Icons";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";

import ViewSavedMovieDetails from "./ViewSavedMovieDetails";
import { TouchableOpacity } from "react-native-gesture-handler";

import { colors } from "../../../globalStyles";
import { useCastData } from "../../../hooks/useCastData";
import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
/**
 * The ViewDetails screen can show the details for a movie in two states:
 * 1. The movie already exists in your saved movies
 * 2. The movie is from the search area and is not yet saved in your saved movies
 *
 * In Case #1, the params object will have a "movieId" key which will be used to load the movie
 * details from the store
 *
 * In Case #2, the params object will have a "movie" key with the movie details populated from
 * the search screen.  This will give you a yellowbox error in RNN v5 because it is a non serailzied object,
 * but it is ok to ignore.
 *
 */
const ViewDetails = ({ navigation, route }) => {
  const { width, height } = useDimensions().window;
  let { state, actions } = useOvermind();

  let movieId = route.params?.movieId;

  //If no movie param, then assume coming from saved movie and get details
  let movie = undefined;
  movie =
    route.params?.movie === undefined && movieId
      ? state.oSaved.getMovieDetails(movieId)
      : route.params.movie;

  // Set the title to the current movie title
  // Also add a + icon for movies that are have not yet been added to list.
  // If the movie is in the list, show a delete icon instead of the plus.
  //TODO (could be better looking delete icon)
  // only on mounting of the component
  React.useEffect(() => {
    navigation.setOptions({
      title: movie.title,
      headerRight: () => {
        if (route.params?.movie) {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                actions.oSaved.saveMovie(movie);
                navigation.goBack();
              }}
            >
              <AddIcon size={35} />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                actions.oSaved.deleteMovie(movieId);
                route.params.movieId = undefined;
                navigation.goBack();
              }}
            >
              <DeleteIcon size={25} />
            </TouchableOpacity>
          );
        }
      },
    });
  }, []);

  // No movieId and no movie passed via params, then just return null
  //TODO: probably need a better "message", but we really should only hit this
  //TODO: when deleteing movie from the right header icon
  if (!movieId && !route.params?.movie) {
    return null;
  }

  if (movieId) {
    return <ViewSavedMovieDetails movieId={movieId} />;
  }
  if (movie) {
    const castData = useCastData(movie.id);
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{
            position: "absolute",
            width,
            height,
            resizeMode: "cover",
            opacity: 0.3,
          }}
          source={{
            uri: movie.backdropURL,
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <DetailMainInfo movie={movie} />
          <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
            <Button
              onPress={() =>
                Linking.openURL(`imdb:///title/${movie.imdbId}`).catch(
                  (err) => {
                    Linking.openURL(
                      "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                    );
                  }
                )
              }
              title="Open in IMDB"
              bgOpacity="ff"
              bgColor={colors.primary}
              small
              width={width / 2}
              wrapperStyle={{
                borderRadius: 0,
              }}
              color="#fff"
              noBorder
            />
          </View>
          <View style={styles.castInfo}>
            {castData.map((person) => (
              <DetailCastInfo
                person={person}
                screenWidth={width}
                key={person.personId}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  castInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
});
//`imdb:///find?q=${movie.title}`
export default ViewDetails;
