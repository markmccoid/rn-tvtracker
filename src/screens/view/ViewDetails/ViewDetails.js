import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { AddIcon, DeleteIcon } from "../../../components/common/Icons";
import { useOState, useOActions } from "../../../store/overmind";

import ViewMovieDetails from "./ViewMovieDetails";

import { TouchableOpacity } from "react-native-gesture-handler";

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
  const [isInSavedMovies, setIsInSavedMovies] = useState(
    !route.params?.notSaved
  );

  const state = useOState();
  const actions = useOActions();
  const { saveMovie, deleteMovie } = actions.oSaved;

  useEffect(() => {
    setIsInSavedMovies(!route.params?.notSaved); //if undefined or false, return true
    let movieTemp = {};
    if (route.params?.movieId) {
      movieTemp = state.oSaved.getMovieDetails(route.params?.movieId);
    }
    if (route.params?.movie) {
      movieTemp = route.params?.movie;
    }
    setMovieData(movieTemp);
  }, [route.params?.movieId, route.params?.movie, route.params?.notSaved]);

  // let movieId = undefined;
  // let movie = undefined;
  // let movieTitle = "Movie";
  // console.log("RERENDER", isInSavedMovies, Object.keys(route.params));
  // if (isInSavedMovies) {
  //   movieId = route.params?.movieId;
  //   movie = state.oSaved.getMovieDetails(movieId);
  //   // movieTitle = movie.title;
  // } else {
  //   movie = route.params?.movie;
  //   movieId = route.params?.movie?.id;
  //   // movieTitle = movie.title;
  // }
  // console.log("AFTER IF", Object.keys(movie));

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
        if (!isInSavedMovies) {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                saveMovie(movieData);
                navigation.navigate(route.name, {
                  movieId: movieData.id,
                  notSaved: false,
                });
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
              onPress={() => {
                //route.params.movieId = undefined;
                deleteMovie(movieData.id);
                navigation.goBack();
              }}
            >
              <DeleteIcon size={25} />
            </TouchableOpacity>
          );
        }
      },
    });
  }, [movieData, isInSavedMovies]);

  // No movieId and no movie passed via params, then just return null
  //TODO: probably need a better "message", but we really should only hit this
  //TODO: when deleteing movie from the right header icon
  if (!movieData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ViewMovieDetails movie={movieData} isInSavedMovies={isInSavedMovies} />
  );
};

//`imdb:///find?q=${movie.title}`
export default ViewDetails;
