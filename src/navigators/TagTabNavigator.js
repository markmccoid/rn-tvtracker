import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import TagScreen from "../screens/TagScreen";
import TagEditScreen from "../screens/TagEditScreen";
import TagStack from "./TagStack";

// Testing nesting a tab navigator in the TagStack
let TagTabNavigator = createBottomTabNavigator(
  {
    TagView: {
      screen: TagStack,
      navigationOptions: () => {
        console.log("in TagView Tag Screen");
      }
    },
    TagEdit: {
      screen: TagEditScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      console.log("inMAINTagTab - HeaderRight");
      return {
        headerRight: (
          <TouchableOpacity onPress={() => navigation.navigate("ViewMovies")}>
            <Feather name="plus" size={30} style={{ marginRight: 10 }} />
          </TouchableOpacity>
        )
      };
    }
  }
);

export default TagTabNavigator;
