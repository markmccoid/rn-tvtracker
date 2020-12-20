import React from "react";
import {
  View,
  Text,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Button } from "../../components/common/Buttons";
import { useOState, useOActions } from "../../store/overmind";
import SearchForMovie from "../../components/search/SearchForMovie";
import SearchResultItem from "../../components/search/SearchResultItem";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const SearchScreen = ({ navigation }) => {
  //Lets us know if we are returning from details page
  //if so, don't clear old search results
  const [onDetailsPage, setOnDetailsPage] = React.useState(false);

  const flatListRef = React.useRef();
  const state = useOState();
  const actions = useOActions();
  const { saveMovie, deleteMovie } = actions.oSaved;
  const {
    searchByTitle,
    loadNextPageMovies,
    setIsNewQuery,
    clearSearchStringAndData,
  } = actions.oSearch;

  const { isLoading, searchString, queryType } = state.oSearch;
  const currentPage = state.oSearch.resultCurrentPage;
  const isMoreData = state.oSearch.resultTotalPages - currentPage > 0;
  const { getPopularMovies } = actions.oSearch;

  const isFocused = useIsFocused();
  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offest: 0 });
  };

  //need to know that this is a new search otherwise
  // it is just pagination
  React.useEffect(() => {
    if (flatListRef.current && state.oSearch.isNewQuery) {
      scrollToTop();
    }
  }, [state.oSearch.resultData, state.oSearch.isNewQuery]);

  //! NO LONGER USING.  Was difficult with showing popular movies
  //! decided to simply not clear
  //Only clear data when we lose focus and did NOT go to the details page.
  // React.useEffect(() => {
  //   if (!isFocused && !onDetailsPage) {
  //     clearSearchStringAndData();
  //   }
  // }, [isFocused, onDetailsPage]);

  // React Navigation hook that runs when this screen gets focus
  // Use this to reset the onDetailsPage flag
  useFocusEffect(() => {
    if (isFocused) {
      setOnDetailsPage(false);
    }
  }, [isFocused]);
  // Write this up ----------------------------------------------------------------
  // Had to use the useFocusEffect in conjunction with useIsFocued hook to
  // know when to clear data NOPE -- Just use useEffect and trigger when isfocused changes
  // If you do it other way, then clear happens when you jump back to screen
  // if you use the useEffect /[isFocused] way, it clears when screen loses focus
  // useFocusEffect(() => {
  //   console.log("FOCUSED");
  //   if (!isFocused) {
  //     console.log("CLEARING SEARCH STRING");
  //     // clearSearchStringAndData();
  //   }
  //   return () => {
  //     if (!isFocused) {
  //       console.log("Clean up");
  //       //   clearSearchStringAndData();
  //     }
  //   };
  // }, []);

  //NOTE: Each page contains 10 items, but with screen redesign 12 movies
  // fit on the first screen, this means that two api calls will happen
  // when searching.  Meaning the currentPage state variable will always be 2
  // after the "first" loading of the flatlist (if search by title)
  // if NO search string then a search by popular movies will start and it defaults
  // to 20 movies per page
  const fetchMoreData = async () => {
    if (isMoreData) {
      setIsNewQuery(false);
      await loadNextPageMovies(currentPage + 1);
    }
  };

  let movieJSX = null;
  if (state.oSearch.resultData) {
    movieJSX = (
      <FlatList
        ref={flatListRef}
        data={state.oSearch.resultData}
        keyExtractor={(movie) => movie.id.toString()}
        numColumns={3}
        renderItem={({ item }) => {
          return (
            <SearchResultItem
              key={item.id}
              movie={item}
              saveMovie={saveMovie}
              deleteMovie={deleteMovie}
              setOnDetailsPage={setOnDetailsPage}
              navigateToScreen="DetailsFromSearch"
            />
          );
        }}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.5}
        keyboardDismissMode="on-drag"
      />
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <SearchForMovie />

        {isLoading && !isMoreData ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : null}
        <View style={{ alignItems: "center" }}>{movieJSX}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SearchScreen;
