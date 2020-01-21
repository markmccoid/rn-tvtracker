import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Button } from "react-native-elements";
// import { useMovieStore } from "../store/createMovieStore";
// import { useMovieActions } from "../context/MovieDataContext";
import { useOvermind } from "../store/overmind";
import SearchForMovie from "../components/SearchForMovie";
import SearchResultItem from "../components/SearchResultItem";

const SearchScreen = ({ navigation }) => {
  let [searchString, setSearchString] = React.useState("");
  const flatListRef = React.useRef();
  const { state, actions } = useOvermind();
  const { saveMovie } = actions.oSaved;
  const { searchByTitle, setIsNewQuery } = actions.oSearch;
  const currentPage = state.oSearch.resultCurrentPage;
  const { isMoreData, isLoading } = state.oSearch;

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offest: 0 });
  };

  //TODO: need to know that this is a new search otherwise
  // it is just pagination
  React.useEffect(() => {
    if (flatListRef.current && state.oSearch.isNewQuery) {
      scrollToTop();
    }
  }, [state.oSearch.resultData, state.oSearch.isNewQuery]);

  // const fetchMoreMovies = async () => {
  //   // Check to see if currentPage < totalPages
  //   // if so, then fetch data for currentPage + 1
  //   if (state.searchResults.currentPage < state.searchResults.totalPages) {
  //     console.log("Getting More DATA");
  //     await actions.searchByTitle({
  //       title: searchString,
  //       page: state.searchResults.currentPage + 1
  //     });
  //   }
  //   return null;
  // };
  const fetchMoreData = async () => {
    if (isMoreData) {
      setIsNewQuery(false);
      await searchByTitle(currentPage + 1);
    }
  };
  let movieJSX = null;
  if (state.oSearch.resultData) {
    movieJSX = (
      <FlatList
        ref={flatListRef}
        data={state.oSearch.resultData}
        keyExtractor={movie => movie.id.toString()}
        renderItem={({ item }) => {
          return <SearchResultItem movie={item} saveMovie={saveMovie} />;
        }}
        onEndReached={fetchMoreData}
        keyboardDismissMode="on-drag"
      />
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <SearchForMovie
        searchString={searchString}
        setSearchString={setSearchString}
      />
      {isLoading && !isMoreData ? (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      ) : null}
      {movieJSX}
    </View>
  );
};

export default SearchScreen;
