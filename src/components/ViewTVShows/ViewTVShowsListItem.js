import React from "react";
import { useDimensions } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";

import MovieColumnLayout from "./MovieColumnLayout";
import TVShowPortraitLayout from "./TVShowPortraitLayout";

//NOTE: posterURL is being passed to force a rerender when the image is changed
// Since we are memoizing this component, it won't rerender when the poserURL
// is changed because it is stored in the movie object (must be shallow compare on objects?)
const ViewTVShowsListItem = ({ posterURL, tvShow, setTVShowEditingId }) => {
  //Bool letting us know if we are in edit mode for this movieId
  const { navigate } = useNavigation();
  const navigateToDetails = () => {
    navigate("DetailsModal", {
      screen: "Details",
      params: { tvShowId: tvShow.id },
    });
  };

  return (
    <TVShowPortraitLayout
      posterURL={posterURL}
      tvShow={tvShow}
      setTVShowEditingId={setTVShowEditingId}
      navigateToDetails={navigateToDetails}
    />
  );
};

export default React.memo(ViewTVShowsListItem);

/* <MovieColumnLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    /> */
