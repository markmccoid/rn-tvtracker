import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Animated,
} from "react-native";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import ListSearchBar from "./ListSearchBar";

import ViewMoviesListItem from "../../../components/ViewMovies/ViewMoviesListItem";
import ViewMovieOverlay from "./ViewMovieOverlay";

const ViewMoviesScreen = ({ navigation, route }) => {
  const { width, height } = useDimensions().window;
  const [movieDetails, setMovieDetails] = React.useState(undefined);
  const flatListRef = React.useRef();
  const { state, actions } = useOvermind();
  const { setMovieEditingId } = actions.oAdmin;
  const { movieEditingId } = state.oAdmin.appState;
  const { getFilteredMovies, getAllMovieTags, getMovieDetails } = state.oSaved;
  // For use in showing the search input component
  const offsetY = React.useRef(new Animated.Value(0)).current;

  const getItemLayout = (data, index) => {
    let height = index === 1 ? 70 : 150;
    return {
      length: height,
      offset: height * index - 70,
      index,
    };
  };

  // console.log('VIEW MOVIE PARAMS', route);

  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2;
  let posterHeight = posterWidth * 1.5;

  let showSearch = route.params?.showSearch;
  //Trying to use this to clear editingId when returning from filter screen.
  //Have to set the "returning" param on both the DONE button in the filter screen component
  //and the header "X"(Close).
  //Not sure if setting the param that we are checking in dependancies is good or bad.
  useEffect(() => {
    if (route.params?.returning) {
      setMovieEditingId();
      navigation.setParams({ returning: false });
    }
  }, [route.params?.returning]);

  // When we show the search bar scroll to the top of the flatlist
  useEffect(() => {
    if (showSearch) {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  }, [showSearch]);

  // Get movie details when movie is selected/edit mode
  // probably should move whole overlay section to a separate file
  useEffect(() => {
    setMovieDetails(getMovieDetails(movieEditingId));
  }, [movieEditingId]);

  return (
    <View style={styles.containerForPortrait}>
      {showSearch ? (
        <ListSearchBar onCancel={() => setShowSearchInput(false)} />
      ) : null}
      <FlatList
        data={getFilteredMovies("date", "asc")}
        ref={flatListRef}
        onScroll={(e) => {
          //   offsetY.setValue(e.nativeEvent.contentOffset.y);
          //   // console.log("Y", e.nativeEvent.contentOffset.y);
          //   if (e.nativeEvent.contentOffset.y < -10) {
          //     // setY(e.nativeEvent.contentOffset.y);
          //     setShowSearchInput(true);
          //   }
        }}
        scrollEventThrottle={16}
        // getItemLayout={getItemLayout}
        keyboardDismissMode
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <ViewMoviesListItem
              movie={item}
              setMovieEditingId={setMovieEditingId}
              movieEditingId={movieEditingId}
            />
          );
        }}
      />
      {/* Only show when editing a movie - this happens on a long press on movie */}
      <ViewMovieOverlay
        movieId={movieEditingId}
        setMovieEditingId={setMovieEditingId}
        isVisible={!!movieEditingId}
        movieDetails={movieDetails}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerForColumn: {
    flex: 1,
  },
  containerForPortrait: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default ViewMoviesScreen;
