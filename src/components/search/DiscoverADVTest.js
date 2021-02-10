import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

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

const DiscoverADVTest = ({ handleAdvancedConfig }) => {
  const state = useOState();
  const { allGenres, queryType } = state.oSearch; // [{ id, name }]

  const [genresState, dispatch] = React.useReducer(reducer, allGenres, genreInit);

  React.useEffect(() => {
    console.log("Mounting ADV Test");
    return () => console.log("******REMOVE ADV Test");
  }, []);
  React.useEffect(() => {
    console.log(
      "Mounting ADV GENRESState Test",
      genresState.genres.filter((el) => el.isSelected)
    );
    if (genresState.genres.length > 0) {
      handleAdvancedConfig({
        genres: genresState.genres.filter((el) => el.isSelected).map((el) => el.id),
      });
    }
    return () => console.log("******REMOVE GENRESState ADV Test");
  }, [genresState.genres]);

  return (
    <View>
      <Text>Discover Advanced Shit</Text>
      {genresState &&
        genresState.genres.map((genre) => (
          <Text key={genre.id}>{`${genre.id}-${genre.name}-${genre.isSelected}`}</Text>
        ))}
      <Button
        title="Remove Comedy"
        onPress={() => {
          dispatch({ type: "REMOVE", genre: { id: 35, name: "Comedy" } });
        }}
      />
      <Button
        title="Add Comedy"
        onPress={() => {
          dispatch({ type: "ADD", genre: { id: 35, name: "Comedy" } });
        }}
      />
    </View>
  );
};

export default DiscoverADVTest;
