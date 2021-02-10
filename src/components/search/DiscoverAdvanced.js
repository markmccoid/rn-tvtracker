import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

import DiscoverByGenre from "./DiscoverByGenre";
import { colors } from "../../globalStyles";
import { first } from "lodash";

const genreInit = (allGenres) => ({
  genres: allGenres.map((genre) => ({ ...genre, isSelected: false })),
});
const reducer = (state, action) => {
  let updatedGenres = {};
  switch (action.type) {
    case "ADD":
      updatedGenres = state.genres.map((el) =>
        el.id === action.genre.id ? { ...action.genre, isSelected: true } : el
      );
      return { ...state, genres: updatedGenres };
    case "REMOVE":
      updatedGenres = state.genres.map((el) =>
        el.id === action.genre.id ? { ...action.genre, isSelected: false } : el
      );
      return { ...state, genres: updatedGenres };
    case "CLEAR":
      updatedGenres = state.genres.map((el) => ({ ...el, isSelected: false }));
      return { ...state, genres: updatedGenres };
    default:
      return state;
  }
};

const DiscoverAdvanced = ({ handleAdvancedConfig }) => {
  const state = useOState();
  const { allGenres, queryType } = state.oSearch; // [{ id, name }]
  //# Genre state objects
  const [genresState, dispatch] = React.useReducer(reducer, allGenres, genreInit);

  React.useEffect(() => {
    console.log(
      "Mounting ADV GENRESState Test",
      genresState.genres.filter((el) => el.isSelected)
    );
    // if (genresState.genres.length > 0) {
    handleAdvancedConfig({
      genres: genresState.genres.filter((el) => el.isSelected).map((el) => el.id),
    });
    // }
    return () => console.log("******REMOVE GENRESState ADV Test");
  }, [genresState.genres]);

  // React.useEffect(() => {
  //   if (queryType !== "advanced") {
  //     genreFilterFunctions.clearFilterGenres();
  //   }
  // }, [queryType]);

  //-- Controls marking genres as selected or not
  const genreFilterFunctions = {
    addGenreToFilter: (genre) => dispatch({ type: "ADD", genre }),
    removeGenreFromFilter: (genre) => dispatch({ type: "REMOVE", genre }),
    clearFilterGenres: () => dispatch({ type: "CLEAR" }),
  };

  const titleSize = "m";
  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Divider style={{ backgroundColor: "black", marginTop: 10 }} />

        <View style={{ flex: 1, flexDirection: "column", marginVertical: 10 }}>
          <DiscoverByGenre
            titleSize={titleSize}
            title="Search By Genres"
            allGenreFilters={genresState.genres}
            filterFunctions={genreFilterFunctions}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    // backgroundColor: colors.background,
  },
  container: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  title: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  filterName: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  tagContainer: {
    marginVertical: 10,
  },
  saveButton: {
    marginBottom: 50,
  },
});

export default React.memo(DiscoverAdvanced);
