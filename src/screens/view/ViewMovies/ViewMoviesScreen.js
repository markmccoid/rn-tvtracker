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

import { useFocusEffect, useNavigationState } from "@react-navigation/native";

import ViewMoviesListItem from "../../../components/ViewMovies/ViewMoviesListItem";
import ViewMovieOverlay from "./ViewMovieOverlay";

const { width, height } = Dimensions.get("window");
//----------------------------
// Based on Finite States Machines, this was a test to
// make things easier to deal with when the filter status
// changed.
// Currently, the ONLY status we get on filter changing is when
// navigating back to the "Movies" route.  There is a param called
// "filterModified" that is either true or undefined.
// This filterMachineConfig and filterMachine are used in the ViewMoviesScreen component
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
const ViewMoviesScreen = ({ navigation, route }) => {
  const [filterState, dispatch] = React.useReducer(filterMachine, filterMachineConfig.initial);
  const [movieDetails, setMovieDetails] = React.useState(undefined);
  const [showSearch, setShowSearch] = useState(false);
  const flatListRef = React.useRef();
  const state = useOState();
  const actions = useOActions();
  const { setMovieEditingId } = actions.oAdmin;
  const { movieEditingId, hydrating } = state.oAdmin.appState;
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

  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2;
  let posterHeight = posterWidth * 1.5;

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
  //   if (filterState === "filterModified" && getFilteredMovies().length > 0) {
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
  useEffect(() => {
    if (route.params?.returning) {
      setMovieEditingId();
      navigation.setParams({ returning: false });
    }
  }, [route.params?.returning]);

  //! Should be able to delete the useEffect below since we don't show
  //! the search with a button, but only when list is at top
  // When we show the search bar scroll to the top of the flatlist
  // useEffect(() => {
  //   if (showSearch) {
  //     flatListRef.current.scrollToIndex({ animated: true, index: 0 });
  //   }
  // }, [showSearch]);

  // Get movie details when movie is selected/edit mode
  // probably should move whole overlay section to a separate file
  useEffect(() => {
    setMovieDetails(getMovieDetails(movieEditingId));
  }, [movieEditingId]);

  return (
    <View style={styles.containerForPortrait}>
      {showSearch ? <ListSearchBar onCancel={() => setShowSearch(false)} /> : null}
      <FlatList
        data={getFilteredMovies()}
        ref={flatListRef}
        onScroll={(e) => {
          offsetY.setValue(e.nativeEvent.contentOffset.y);
          // console.log("Y", e.nativeEvent.contentOffset.y);
          if (e.nativeEvent.contentOffset.y < -50) {
            // setY(e.nativeEvent.contentOffset.y);
            setShowSearch(true);
          }
        }}
        scrollEventThrottle={16}
        // getItemLayout={getItemLayout}
        keyboardDismissMode
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={2}
        renderItem={({ item, index }) => {
          const pURL = item.posterURL;
          return (
            <ViewMoviesListItem
              posterURL={pURL}
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
      {/* If there are NO movies after the filters are applied then show a message and Filter button  */}
      {getFilteredMovies().length === 0 && state.oSaved.savedMovies.length !== 0 && (
        <View style={[styles.noMoviesShownPosition, { alignItems: "center" }]}>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            No Movies match current filter.
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "600", marginBottom: 10 }}>
            Modify filter.
          </Text>

          <TouchableOpacity
            style={[
              styles.noMoviesShownBtnView,
              { width: 75, height: 75, justifyContent: "center", alignItems: "center" },
            ]}
            onPress={() => navigation.navigate("Filter")}
          >
            <FilterIcon size={40} />
          </TouchableOpacity>
        </View>
      )}

      {state.oSaved.savedMovies.length === 0 && !hydrating && (
        <View style={[styles.noMoviesShownPosition, styles.noMoviesShownBtnView]}>
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
  },
  noMoviesShownPosition: {
    position: "absolute",
    top: height / 4,
  },
  noMoviesShownBtnView: {
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

export default ViewMoviesScreen;
