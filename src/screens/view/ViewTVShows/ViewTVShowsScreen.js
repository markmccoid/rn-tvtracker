import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, StyleSheet, Animated, TouchableOpacity } from "react-native";

import { useOState, useOActions } from "../../../store/overmind";
import ListSearchBar from "./ListSearchBar";
import { AddIcon, FilterIcon } from "../../../components/common/Icons";

import ViewTVShowsListItem from "../../../components/ViewTVShows/ViewTVShowsListItem";
import { colors } from "../../../globalStyles";
import {
  getViewRotates,
  getViewTranslates,
  getViewScale,
  getViewOpacity,
} from "./animationHelpers";

import { SavedTVShowsDoc } from "../../../store/oSaved/state";

const { width, height } = Dimensions.get("window");
const POSTER_WIDTH = width / 2.2;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Height is 1.5 times the width
const MARGIN = 5;
// The 9 is from the TVShowPortraitLayout.tsx and it is the Episode Length bar (view) space.
const ITEM_SIZE = POSTER_HEIGHT + 9 + MARGIN * 2;

//---------------
const ViewTVShowsScreen = ({ navigation, route }) => {
  const [showSearch, setShowSearch] = useState(false);

  const flatListRef = React.useRef();
  const state = useOState();
  const { hydrating } = state.oAdmin.appState;

  const {
    filterData: { searchFilter },
    getFilteredTVShows,
    getTVShowDetails,
  } = state.oSaved;
  // For use in showing the search input component
  const offsetY = React.useRef(new Animated.Value(0)).current;

  // const POSTER_WIDTH = width / 2.2;
  // const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Height is 1.5 times the width
  // const MARGIN = 5;
  // const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;

  //#-------------------
  //# Flatlist functions
  //#-------------------
  const getLayoutItem = React.useCallback((data, index) => {
    return {
      length: ITEM_SIZE,
      offset: ITEM_SIZE * index,
      index,
    };
  }, []);

  const keyExtractor = React.useCallback((tvShow, idx) => tvShow.id.toString() + idx, []);

  const flatListRenderItem = React.useCallback(({ item, index }) => {
    const pURL = item.posterURL;
    // Since we have two rows, this is the correct index
    // index 0,1 -> 0,0  index 2,3 => 1,1  etc...
    const ITEM_INDEX = Math.floor(index / 2);

    const animConstants = {
      itemSize: ITEM_SIZE,
      itemIndex: ITEM_INDEX,
      absIndex: index,
      posterHeight: POSTER_HEIGHT,
      posterWidth: POSTER_WIDTH,
      margin: MARGIN,
    };

    const scale = getViewScale(offsetY, animConstants);
    const opacity = getViewOpacity(offsetY, animConstants);
    const [translateX, translateY] = getViewTranslates(offsetY, animConstants);
    const [rotateX, rotateY, rotateZ] = getViewRotates(offsetY, animConstants);
    const animStyle = {
      transform: [
        { scale },
        { translateX },
        { translateY },
        { rotateX },
        // { rotateY },
        // { rotateZ },
      ],
    };
    return (
      <Animated.View
        style={{
          opacity,
          ...animStyle,
        }}
      >
        <ViewTVShowsListItem posterURL={pURL} tvShow={item} />
      </Animated.View>
    );
  }, []);

  //NOTE-- posterURL images are 300 x 450

  // effect runs whenever getFilteredTVShows returns a different
  // number of shows
  // this causes the flatlist to scroll to top
  //! Reason for this is because I don't want it to scroll to top when
  //! changes are made to a show, ONLY when the filter is changed
  //! Downside: it won't scroll to top when a different filter returns the same number of shows
  //! 1. Option would be to use the route.params.filterModified flag, BUT this won't trigger if
  //!    if filter modal is pulled down.
  //! 2. add dirtyTVShowList indicator in overmind that we will use to determine when to scroll to top.
  //!    won't set dirty indicator to true if just a tag change.
  //!    need dirty indicator because we will still pass new data to flatlist, but DON'T WANT to scroll to top
  useEffect(() => {
    if (flatListRef) {
      flatListRef.current.scrollToOffset({ offset: 0 });
    }
  }, [getFilteredTVShows.length]);

  return (
    <View style={styles.containerForPortrait}>
      <ListSearchBar visible={showSearch} onCancel={() => setShowSearch(false)} />

      <Animated.FlatList
        data={getFilteredTVShows}
        ref={flatListRef}
        onScroll={(e) => {
          // show or hide search input
          if (e.nativeEvent.contentOffset.y < -50) {
            setShowSearch(true);
          } else if (e.nativeEvent.contentOffset.y > 50 && !searchFilter) {
            setShowSearch(false);
          }
          offsetY.setValue(e.nativeEvent.contentOffset.y);
        }}
        scrollEventThrottle={16}
        keyboardDismissMode
        keyExtractor={keyExtractor}
        numColumns={2}
        getItemLayout={getLayoutItem}
        renderItem={flatListRenderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={30}
      />

      {/* If there are NO TV Shows after the filters are applied then show a message and Filter button  */}
      {getFilteredTVShows.length === 0 && state.oSaved.savedTVShows.length !== 0 && (
        <View style={[styles.noItemsShownPosition, { alignItems: "center" }]}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            No TV Shows match current filter.
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            Modify filter.
          </Text>

          <TouchableOpacity
            style={[
              styles.noItemsShownBtnView,
              { width: 75, height: 75, justifyContent: "center", alignItems: "center" },
            ]}
            onPress={() => navigation.navigate("Filter")}
          >
            <FilterIcon size={40} />
          </TouchableOpacity>
        </View>
      )}

      {state.oSaved.savedTVShows.length === 0 && !hydrating && (
        <View style={[styles.noItemsShownPosition, styles.noItemsShownBtnView]}>
          <TouchableOpacity
            style={{ width: 75, height: 75, justifyContent: "center", alignItems: "center" }}
            onPress={() => navigation.navigate("SearchStack", { screen: "Search" })}
          >
            <AddIcon size={50} />
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: colors.background,
  },
  noItemsShownPosition: {
    position: "absolute",
    top: height / 4,
  },
  noItemsShownBtnView: {
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default ViewTVShowsScreen;
