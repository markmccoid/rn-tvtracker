import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, ScrollView, View, Image, Dimensions } from "react-native";
import { AddIcon, DeleteIcon } from "../../../components/common/Icons";
import { useOState, useOActions } from "../../../store/overmind";

import ViewMovieDetails from "./ViewMovieDetails";

import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
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
 * The other param passed with Case #2 is "notSaved" which when true indicates that this navigate has a movie that
 * is NOT saved.  I used this negative way so that if we don't get this param passed we can safely assume that the
 * navigation event is coming from a place where the movie is saved.
 *
 */
const ViewDetails = ({ navigation, route }) => {
  const [movieData, setMovieData] = useState(undefined);
  const [isInSavedMovies, setIsInSavedMovies] = useState(!!!route.params?.notSaved);
  const [isLoading, setIsLoading] = useState(false);
  const state = useOState();
  const actions = useOActions();
  const { saveMovie, deleteMovie, apiGetMovieDetails } = actions.oSaved;
  const getTempMovieDetails = async (movieId) => {
    movieTemp = await apiGetMovieDetails(movieId);
    setMovieData(movieTemp.data);
  };

  useEffect(() => {
    setIsInSavedMovies(!!!route.params?.notSaved); //if undefined or false, return true
    let movieTemp = {};
    if (route.params?.movieId) {
      movieTemp = state.oSaved.getMovieDetails(route.params?.movieId);
      setMovieData(movieTemp);
      return;
    }
    if (route.params?.movie) {
      // movieTemp = route.params?.movie;
      getTempMovieDetails(route.params?.movie.id);
      return;
    }
  }, [route.params?.movieId, route.params?.movie, route.params?.notSaved]);

  //---- Set navigation options for detail screen -----
  // 1. Set the title to the current movie title
  // 2. Add a + icon for movies that are have not yet been added to list.
  // 3. If the movie is in the list, show a delete icon INSTEAD of the plus.
  //TODO (could be better looking delete icon)
  React.useEffect(() => {
    if (!movieData) {
      return;
    }

    navigation.setOptions({
      title: movieData.title,
      headerRight: () => {
        if (isLoading) {
          return <ActivityIndicator style={{ marginRight: 20 }} />;
        }
        if (!isInSavedMovies) {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={async () => {
                setIsLoading(true);
                await saveMovie(movieData);
                navigation.navigate(route.name, {
                  movieId: movieData.id,
                  movie: undefined,
                  notSaved: false,
                });
                setIsLoading(false);
                // navigation.goBack();
              }}
            >
              <AddIcon size={35} />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={async () => {
                setIsLoading(true);
                await deleteMovie(movieData.id);
                setIsLoading(false);
                navigation.goBack();
              }}
            >
              <DeleteIcon size={25} />
            </TouchableOpacity>
          );
        }
      },
    });
  }, [movieData, isInSavedMovies, isLoading]);

  // No movieId and no movie passed via params, then just return null
  //TODO: probably need a better "message", but we really should only hit this
  //TODO: when deleteing movie from the right header icon
  if (!movieData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{
          position: "absolute",
          width,
          height,
          resizeMode: "cover",
          opacity: 0.1,
        }}
        source={{
          uri: movieData.posterURL,
        }}
      />
      <ScrollView>
        <ViewMovieDetails movie={movieData} isInSavedMovies={isInSavedMovies} />
      </ScrollView>
    </View>
  );
};

//`imdb:///find?q=${movie.title}`
export default ViewDetails;
