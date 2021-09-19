import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

import { useOState, useOActions } from "../../store/overmind";
import DiscoverBottomSheet from "../../components/search/DiscoverBottomSheet";
import SearchResultItem from "../../components/search/SearchResultItem";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { colors } from "../../globalStyles";
import { TVSearchResult, TVSearchItem } from "../../types";

const SearchScreen = ({ navigation, route }) => {
  //Lets us know if we are returning from details page
  //if so, don't clear old search results
  const [onDetailsPage, setOnDetailsPage] = React.useState(false);
  const deepLinkTitle = route?.params?.name;
  const flatListRef = React.useRef();
  const state = useOState();
  const actions = useOActions();
  const { saveTVShow, deleteTVShow } = actions.oSaved;
  const { queryTVAPI, setIsNewQuery } = actions.oSearch;

  const { isLoading } = state.oSearch;
  const currentPage = state.oSearch.resultCurrentPage;
  const isMoreData = state.oSearch.resultTotalPages - currentPage > 0;

  const isFocused = useIsFocused();
  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offest: 0 });
  };

  const tvResultData: TVSearchItem[] = state.oSearch.resultData;

  //need to know that this is a new search otherwise
  // it is just pagination
  React.useEffect(() => {
    if (flatListRef.current && state.oSearch.isNewQuery) {
      scrollToTop();
    }
  }, [tvResultData, state.oSearch.isNewQuery]);

  // React Navigation hook that runs when this screen gets focus
  // Use this to reset the onDetailsPage flag
  useFocusEffect(() => {
    if (isFocused) {
      setOnDetailsPage(false);
    }
  });
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
      await queryTVAPI(currentPage + 1);
    }
  };

  let tvJSX = null;
  if (tvResultData) {
    tvJSX = (
      <FlatList
        ref={flatListRef}
        data={tvResultData}
        keyExtractor={(tvShow) => tvShow.id.toString()}
        numColumns={3}
        renderItem={({ item }) => {
          return (
            <SearchResultItem
              key={item.id}
              tvShow={item}
              saveTVShow={() => saveTVShow(item.id)}
              deleteTVShow={deleteTVShow}
              setOnDetailsPage={setOnDetailsPage}
              navigateToScreen="DetailsFromSearch"
              // navigateToScreen="DetailsFromSearch"
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
      <View style={styles.searchContainer}>
        {/* <SearchForMovie /> */}

        {isLoading && !isMoreData ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : null}
        <View style={{ alignItems: "center" }}>{tvJSX}</View>
        <DiscoverBottomSheet deepLinkTitle={deepLinkTitle} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
export default SearchScreen;
