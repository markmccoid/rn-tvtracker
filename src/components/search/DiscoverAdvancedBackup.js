import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

import DiscoverByGenre from "./DiscoverByGenre";
import { colors } from "../../globalStyles";
import { first } from "lodash";

const DiscoverAdvanced = ({}) => {
  const state = useOState();
  const { allGenres, queryType } = state.oSearch; // [{ id, name }]
  //# Genre state objects
  // populated intially with no selected genres. [ { genre, isSelected }]
  const [genresObj, setGenresObj] = React.useState(() =>
    allGenres.map((genre) => ({ ...genre, isSelected: false }))
  );
  //-Whenever a genre's isSelected property is updated, send selected to handleAdvancedConfig
  const selectedGenres = React.useMemo(
    () => genresObj.filter((g) => g.isSelected).map((g) => g.id),
    [genresObj]
  );

  React.useEffect(() => {
    // Confirm an Advanced search has been initiated (at least one item selected)
    // handleAdvancedConfig({ genres: selectedGenres });
    // return () => console.log("LEAVING ADVANCED JS", selectedGenres);
  }, [selectedGenres]);

  React.useEffect(() => {
    if (queryType !== "advanced") {
      genreFilterFunctions.clearFilterGenres();
    }
  }, [queryType]);
  //-- Controls marking genres as selected or not
  const genreFilterFunctions = {
    addGenreToFilter: (genre) =>
      setGenresObj((prevGenreObj) =>
        prevGenreObj.map((el) => (el.id === genre.id ? { ...genre, isSelected: true } : el))
      ),
    removeGenreFromFilter: (genre) =>
      setGenresObj((prevGenreObj) =>
        prevGenreObj.map((el) => (el.id === genre.id ? { ...genre, isSelected: false } : el))
      ),
    clearFilterGenres: () =>
      setGenresObj((prevGenres) =>
        prevGenres.map((genreObj) => ({ ...genreObj, isSelected: false }))
      ),
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
            allGenreFilters={genresObj}
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
