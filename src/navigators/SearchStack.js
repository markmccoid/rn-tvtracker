import React from "react";
import { createStackNavigator } from "react-navigation-stack";

import SearchScreen from "../screens/SearchScreen";

const SearchStack = createStackNavigator({
  Search: {
    screen: SearchScreen,
    navigationOptions: { title: "Search For Movie" }
  }
});

export default SearchStack;
