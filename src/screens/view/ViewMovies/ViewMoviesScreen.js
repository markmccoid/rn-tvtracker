import React, { useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import * as Styled from "./styles";
import { useOvermind } from "../../../store/overmind";

import ViewMoviesListItem from "../../../components/ViewMovies/ViewMoviesListItem";

const ViewMoviesScreen = ({ navigation, route }) => {
  const { state, actions } = useOvermind();
  const { setMovieEditingId } = actions.oAdmin;
  const { movieEditingId } = state.oAdmin.appState;

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
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={state.oSaved.getFilteredMovies}
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        // numColumns={2}
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
    </View>
  );
};

const styles = StyleSheet.create({});

export default ViewMoviesScreen;
