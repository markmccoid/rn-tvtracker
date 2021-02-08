import React from "react";
import {
  Animated,
  Easing,
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { CloseIcon } from "../common/Icons";
// import { SearchBar, Button } from "react-native-elements";
import { useOActions, useOState } from "../../store/overmind";
import { useNavigation } from "@react-navigation/native";
import { searchByTitle } from "../../store/oSearch/actions";

const DiscoverInputTitle = ({ setSearchString, searchString, sheetFunctions }) => {
  let inputRef = React.useRef(); // Not using right now
  const [height, setHeight] = React.useState(20);
  const state = useOState();
  const actions = useOActions();

  // Set up the Popular Movies Header
  // Set up the Popular Movies Header

  //oSearch.queryType, can we use this to set which pre-defined
  //search we do -> popular, now playing, upcoming
  //Also, maybe have another called discover, which also searches for
  //genre, title, actors????
  //--The "Header/popular row" needs to be moved into it's own component
  //--The MovieSearch TextInput needs to be a controlled component
  //--controlled from the bottomsheet component.
  //--Each component will set the searchCriteria State field and the
  //--bottomsheet component will control the calling of the "queryMovieAPIWithConfig()" function.
  //--The queryMovieAPIWithConfig function should be renamed and will also need to accept
  //--new arguments.  Maybe an object
  //-- typeOfSearch: "title", "predefined", "advanced"
  //-- data: {
  //     searchString: used as movie title in both "title" and "advanced",
  //        in predefined it will be either "popular" or "nowplaying" or "upcoming"
  //     genres: [] // only in "advanced"
  //   }

  const handleSearchString = (searchString) => {
    setSearchString(searchString);
  };
  return (
    <View>
      <View style={styles.searchBar}>
        <TextInput
          ref={inputRef}
          placeholder="Search Movie Title"
          onChangeText={handleSearchString}
          value={searchString}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={() => {
            // expand sheet to max height to avoid the keyboard
            sheetFunctions.snapTo(1);
          }}
          onBlur={() => {
            // dismiss keyboard and collapse sheet.
            Keyboard.dismiss();
            sheetFunctions.collapseSheet();
          }}
        />
        <TouchableOpacity
          onPress={() => handleSearchString("")}
          style={{ position: "absolute", right: 15 }}
        >
          <CloseIcon size={20} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingTop: 10,
    margin: 10,
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
});

export default DiscoverInputTitle;
