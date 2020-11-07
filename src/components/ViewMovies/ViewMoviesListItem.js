import React from "react";
import { useDimensions } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";

import MovieColumnLayout from "./MovieColumnLayout";
import MoviePortraitLayout from "./MoviePortraitLayout";

const ViewMoviesListItem = ({ movie, setMovieEditingId, movieEditingId }) => {
  //Bool letting us know if we are in edit mode for this movieId
  const inEditState = movieEditingId === movie.id;
  const { navigate } = useNavigation();

  const navigateToDetails = () => {
    setMovieEditingId(); // clear editing Id
    navigate("Details", { movieId: movie.id });
  };

  return (
    <MoviePortraitLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    />
  );
};

export default React.memo(ViewMoviesListItem);

/* <MovieColumnLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    /> */
