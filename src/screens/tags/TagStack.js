import React from "react";
import { Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import TagScreen from "./TagScreen";

const TagStack = createStackNavigator();

const TagStackScreen = () => {
  return (
    <TagStack.Navigator>
      <TagStack.Screen name="Tags" component={TagScreen} />
    </TagStack.Navigator>
  );
};

export default TagStackScreen;
