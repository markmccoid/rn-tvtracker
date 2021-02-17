import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";
import DiscoverAdvByGenre from "./DiscoverAdvByGenre";
import DiscoverAdvYears from "./DiscoverAdvYears";
import DiscoverAdvProviders from "./DiscoverAdvProviders";
import { colors } from "../../globalStyles";

const genreInit = (allGenres) => ({
  genres: allGenres.map((genre) => ({ ...genre, isSelected: false })),
});

const reducer = (state, action) => {
  let updatedGenres = {};
  switch (action.type) {
    case "ADD":
      updatedGenres = state.genres.map((el) =>
        el.id === action.genre.id ? { ...el, isSelected: true } : el
      );
      return { ...state, genres: updatedGenres };
    case "REMOVE":
      updatedGenres = state.genres.map((el) =>
        el.id === action.genre.id ? { ...el, isSelected: false } : el
      );
      return { ...state, genres: updatedGenres };
    case "CLEAR":
      updatedGenres = state.genres.map((el) => ({ ...el, isSelected: false }));
      return { ...state, genres: updatedGenres };
    default:
      return state;
  }
};

const DiscoverAdvanced = ({
  handleAdvReleaseYear,
  selectedGenres,
  handleAdvGenres,
  handleAdvWatchProviders,
}) => {
  const state = useOState();
  const { allGenres } = state.oSearch; // [{ id, name }]
  //# Genre state objects
  // const [genresState, dispatch] = React.useReducer(reducer, allGenres, genreInit);

  //-- Controls marking genres as selected or not
  const genreFilterFunctions = {
    addGenreToFilter: (genreId) => handleAdvGenres.addGenre(genreId),
    removeGenreFromFilter: (genreId) => handleAdvGenres.removeGenre(genreId),
    clearFilterGenres: () => handleAdvGenres.clearGenres(),
  };
  // const genreFilterFunctions = {
  //   addGenreToFilter: (genre) => dispatch({ type: "ADD", genre }),
  //   removeGenreFromFilter: (genre) => dispatch({ type: "REMOVE", genre }),
  //   clearFilterGenres: () => dispatch({ type: "CLEAR" }),
  // };

  const titleSize = "m";
  return (
    <View style={styles.container}>
      <Divider style={{ backgroundColor: "black", marginTop: 10 }} />

      <View style={{ flexDirection: "column", marginVertical: 10 }}>
        <DiscoverAdvByGenre
          titleSize={titleSize}
          title="Search By Genres"
          selectedGenres={selectedGenres}
          allGenreFilters={allGenres}
          filterFunctions={genreFilterFunctions}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <DiscoverAdvYears handleAdvReleaseYear={handleAdvReleaseYear} />
        <DiscoverAdvProviders handleAdvWatchProviders={handleAdvWatchProviders} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    // backgroundColor: colors.background,
    marginBottom: 40,
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
