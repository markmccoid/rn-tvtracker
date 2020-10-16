import React from "react";
import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
// import { SearchBar, Button } from "react-native-elements";
import { useOActions, useOState } from "../../store/overmind";
import { useNavigation } from "@react-navigation/native";

const SearchForMovie = ({ setSearchString }) => {
  let inputRef = React.useRef(); // Not using right now
  const state = useOState();
  const actions = useOActions();
  let { searchPassingTitle } = actions.oSearch;
  let { searchString } = state.oSearch;
  let navigation = useNavigation();

  return (
    <View>
      <TextInput
        placeholder="Search Movie Title"
        onChangeText={(e) => searchPassingTitle(e)}
        value={searchString}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={styles.searchBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
    fontSize: 18,
    margin: 5,
    borderRadius: 5,
  },
  searchBar: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
});

export default SearchForMovie;
