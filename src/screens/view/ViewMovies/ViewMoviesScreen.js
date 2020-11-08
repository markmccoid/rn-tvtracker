import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Animated } from "react-native";
import { useOState, useOActions } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import ListSearchBar from "./ListSearchBar";

import ViewMoviesListItem from "../../../components/ViewMovies/ViewMoviesListItem";
import ViewMovieOverlay from "./ViewMovieOverlay";

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
  const { width, height } = useDimensions().window;
  const [movieDetails, setMovieDetails] = React.useState(undefined);
  const [showSearch, setShowSearch] = useState(false);
  const flatListRef = React.useRef();
  const state = useOState();
  const actions = useOActions();
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

  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2;
  let posterHeight = posterWidth * 1.5;

  //Next two useEffects are for determining if a filter was modified and if so, then scroll to top
  //Looking at the filterModified param (true or undefined) coming from the Movies route
  //* May make sense to instead put a "filter dirty" flag in overmind state
  useEffect(() => {
    let dispatchType = route.params?.filterModified ? "MODIFIED" : "SCROLLDONE";

    dispatch({ type: dispatchType });
    if (route.params?.filterModified) {
      route.params.filterModified = undefined;
    }
  }, [route.params?.filterModified]);

  useEffect(() => {
    if (filterState === "filterModified") {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
      dispatch({ type: "SCROLLDONE" });
    }
  }, [filterState]);
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
      {showSearch ? <ListSearchBar onCancel={() => setShowSearch(false)} /> : null}
      <FlatList
        data={getFilteredMovies("date", "dec")}
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
