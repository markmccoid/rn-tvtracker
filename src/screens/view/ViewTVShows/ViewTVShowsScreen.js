import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useOState, useOActions } from "../../../store/overmind";
import ListSearchBar from "./ListSearchBar";
import { AddIcon, FilterIcon } from "../../../components/common/Icons";

import ViewTVShowsListItem from "../../../components/ViewTVShows/ViewTVShowsListItem";
import ViewTVShowOverlay from "./ViewTVShowOverlay";
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
const ITEM_SIZE = POSTER_HEIGHT + MARGIN * 2;

//----------------------------
// Based on Finite States Machines, this was a test to
// make things easier to deal with when the filter status
// changed.
// Currently, the ONLY status we get on filter changing is when
// navigating back to the "TVShowsScreen" route.  There is a param called
// "filterModified" that is either true or undefined.
// This filterMachineConfig and filterMachine are used in the ViewTVShowsScreen component
// useReducer function, which changes the "filterState" variable.
// There are two useEffect functions that are needed
// One to monitor the "filterModified" route param
// and another to monitor the filterState variable.
// -----
// Maybe better option would be to have a state variable in Overmind that is set whenever a
// filter is changed and applied.
//----------------------------
const filterMachineConfig = {
  initial: "idle",
  states: {
    idle: {
      on: {
        MODIFIED: "filterModified",
      },
    },
    filterModified: {
      on: {
        SCROLLDONE: "idle",
      },
    },
  },
};

const filterMachine = (state, event) => {
  return filterMachineConfig.states[state]?.on?.[event.type] || state;
};

//---------------
const ViewTVShowsScreen = ({ navigation, route }) => {
  const [filterState, dispatch] = React.useReducer(filterMachine, filterMachineConfig.initial);
  const [tvShowDetails, setTVShowDetails] = React.useState(undefined);
  const [showSearch, setShowSearch] = useState(false);
  // Used to be in oAdmin.appState, but don't think we need it there, just making local state.
  const [tvShowEditingId, setTVShowEditingId] = useState(undefined);
  const flatListRef = React.useRef();
  const state = useOState();
  const { hydrating } = state.oAdmin.appState;

  const { getFilteredTVShows, getTVShowDetails } = state.oSaved;
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
        <ViewTVShowsListItem
          posterURL={pURL}
          tvShow={item}
          setTVShowEditingId={setTVShowEditingId}
        />
      </Animated.View>
    );
  }, []);

  //NOTE-- posterURL images are 300 x 450

  //Next two useEffects are for determining if a filter was modified and if so, then scroll to top
  //Looking at the filterModified param (true or undefined) coming from the Movies route
  //!! Commented out so DONE button on filter screen acts the same as a pull down dismiss
  //!! This was code that would scroll to top whenever a filter was applied
  // useEffect(() => {
  //   if (!route.params?.filterModified) return;
  //   let dispatchType = route.params?.filterModified ? "MODIFIED" : "SCROLLDONE";

  //   dispatch({ type: dispatchType });
  //   // if (route.params?.filterModified) {
  //   //   route.params.filterModified = undefined;
  //   // }
  // }, [route.params?.filterModified]);

  // useEffect(() => {
  //   if (filterState === "filterModified" && getFilteredTVShows().length > 0) {
  //     flatListRef.current.scrollToIndex({ animated: true, index: 0 });
  //     dispatch({ type: "SCROLLDONE" });
  //     route.params.filterModified = undefined;
  //   }
  // }, [filterState]);
  //---------------------------------------------------

  //Trying to use this to clear editingId when returning from filter screen.
  //Have to set the "returning" param on both the DONE button in the filter screen component
  //and the header "X"(Close).
  //Not sure if setting the param that we are checking in dependancies is good or bad.
  // useEffect(() => {
  //   if (route.params?.returning) {
  //     setTVShowEditingId();
  //     navigation.setParams({ returning: false });
  //   }
  // }, [route.params?.returning]);

  // effect runs whenever getFilteredTVShows is dirty
  // this causes the flatlist to scroll to top
  //! this will trigger whenever a movie is updated.
  //! it will scroll to top.  OPTIONS:
  //! 1. remove tags from oSaved.savedMovies
  //! 2. add dirtyMovieList indicator in overmind that we will use to determine when to scroll to top.
  //!    won't set dirty indicator to true if just a tag change.
  //!    need dirty indicator because we will still pass new data to flatlist, but DON'T WANT to scroll to top
  useEffect(() => {
    // console.log("getFilteredTVShows RERENDER");
    if (flatListRef) {
      flatListRef.current.scrollToOffset({ offset: 0 });
    }
  }, [getFilteredTVShows]);

  // Get movie details when movie is selected/edit mode
  // probably should move whole overlay section to a separate file
  useEffect(() => {
    if (tvShowEditingId) {
      setTVShowDetails(getTVShowDetails(tvShowEditingId));
    }
  }, [tvShowEditingId]);

  return (
    <View style={styles.containerForPortrait}>
      {showSearch ? <ListSearchBar onCancel={() => setShowSearch(false)} /> : null}
      <Animated.FlatList
        data={getFilteredTVShows}
        ref={flatListRef}
        onScroll={(e) => {
          offsetY.setValue(e.nativeEvent.contentOffset.y);
          if (e.nativeEvent.contentOffset.y < -50) {
            setShowSearch(true);
          }
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

      {/* Only show when editing a tv show - this happens on a long press on tv show */}
      <ViewTVShowOverlay
        tvShowId={tvShowEditingId}
        setTVShowEditingId={setTVShowEditingId}
        isVisible={!!tvShowEditingId}
        tvShowDetails={tvShowDetails}
      />
      {/* If there are NO movies after the filters are applied then show a message and Filter button  */}
      {getFilteredTVShows.length === 0 && state.oSaved.savedTVShows.length !== 0 && (
        <View style={[styles.noItemsShownPosition, { alignItems: "center" }]}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            No Movies match current filter.
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
            onPress={() => navigation.navigate("Search")}
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
