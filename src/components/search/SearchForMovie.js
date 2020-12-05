import React from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
// import { SearchBar, Button } from "react-native-elements";
import { useOActions, useOState } from "../../store/overmind";
import { useNavigation } from "@react-navigation/native";
import { searchByTitle } from "../../store/oSearch/actions";

const SearchForMovie = () => {
  let inputRef = React.useRef(); // Not using right now
  const [height, setHeight] = React.useState(20);
  const state = useOState();
  const actions = useOActions();
  let { searchPassingTitle } = actions.oSearch;
  let { searchString } = state.oSearch;
  let navigation = useNavigation();

  // Run once to get the popular movies to show
  React.useEffect(() => {
    searchPassingTitle("");
  }, []);

  // Set up the Popular Movies Header
  const Header = React.useCallback(
    () => (
      <View style={{ alignItems: "center", marginBottom: 5, height }}>
        <Text>Popular Movies</Text>
      </View>
    ),
    [height]
  );

  const handleSearchByTitle = (e) => {
    if (e.trim()) {
      setHeight(0);
    } else {
      setHeight(20);
    }
    searchPassingTitle(e);
  };
  return (
    <View>
      <TextInput
        placeholder="Search Movie Title"
        onChangeText={handleSearchByTitle}
        value={searchString}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={styles.searchBar}
      />
      <Header />
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
