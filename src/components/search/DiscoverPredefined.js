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
import { predefinedTypesEnum } from "../../statemachines/discoverMoviesMachine";

const DiscoverPredefined = ({
  expandSheet,
  collapseSheet,
  queryType,
  predefinedType,
  setPredefined,
  predefinedQueries,
}) => {
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
  const predefinedTypesArray = Object.keys(predefinedTypesEnum).map(
    (key) => predefinedTypesEnum[key]
  );
  return (
    <View
      style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-around" }}
    >
      {predefinedTypesArray.map((predefinedItem) => (
        <View
          key={predefinedItem}
          style={{
            borderWidth: 1,
            borderColor: "black",
            paddingVertical: 5,
            paddingHorizontal: 10,
            // marginHorizontal: 4,
            borderRadius: 8,
            backgroundColor: predefinedType === predefinedItem ? "#ccc" : "white",
          }}
        >
          <TouchableOpacity onPress={() => setPredefined(predefinedItem)}>
            <Text>{predefinedItem}</Text>
          </TouchableOpacity>
        </View>
      ))}
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

export default DiscoverPredefined;
