import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import TagScreen from "../screens/TagScreen";
import TagEditScreen from "../screens/TagEditScreen";

const TagStack = createStackNavigator({
  TagS1: {
    screen: TagScreen,
    navigationOptions: {
      title: "Tag S1"
    }
  },
  TagS2: {
    screen: TagEditScreen,
    navigationOptions: {
      title: "Tags"
    }
  }
});

export default TagStack;
