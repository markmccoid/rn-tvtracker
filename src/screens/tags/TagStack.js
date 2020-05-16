import React from "react";
import { TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "../../components/common/Icons";

import TagScreen from "./TagScreen";

const TagStack = createStackNavigator();

const TagStackScreen = () => {
  return (
    <TagStack.Navigator>
      <TagStack.Screen
        name="Tags"
        component={TagScreen}
        options={({ navigation, route }) => {
          return {
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
    </TagStack.Navigator>
  );
};

export default TagStackScreen;
