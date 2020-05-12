import React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SearchScreen from "./SearchScreen";

const SearchStack = createStackNavigator();

const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="Search" component={SearchScreen} />
    </SearchStack.Navigator>
  );
};

export default SearchStackScreen;
