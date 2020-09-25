import React from "react";
import { Button, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "../../components/common/Icons";

import SearchScreen from "./SearchScreen";
import ViewDetails from "../view/ViewDetails/ViewDetails";
const SearchStack = createStackNavigator();

const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
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
      <SearchStack.Screen name="DetailsFromSearch" component={ViewDetails} />
    </SearchStack.Navigator>
  );
};

export default SearchStackScreen;
