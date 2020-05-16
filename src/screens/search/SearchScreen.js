import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "../../components/common/Buttons";
import { useOvermind } from "../../store/overmind";
import SearchForMovie from "../../components/search/SearchForMovie";
import SearchResultItem from "../../components/search/SearchResultItem";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

const SearchScreen = ({ navigation }) => {
  let [searchString, setSearchString] = React.useState("");
  const flatListRef = React.useRef();
  const { state, actions } = useOvermind();
  const { saveMovie } = actions.oSaved;
  const {
    searchByTitle,
    setIsNewQuery,
    clearSearchStringAndData,
  } = actions.oSearch;
  const currentPage = state.oSearch.resultCurrentPage;
  const { isMoreData, isLoading } = state.oSearch;

  const isFocused = useIsFocused();
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

  React.useEffect(() => {
    if (!isFocused) {
      clearSearchStringAndData();
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
        keyExtractor={(movie) => movie.id.toString()}
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
