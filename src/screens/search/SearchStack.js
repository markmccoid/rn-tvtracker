import React from "react";
import { Button, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "../../components/common/Icons";

import SearchScreen from "./SearchScreen";
import ViewDetails from "../view/ViewDetails/ViewDetails";
import DetailPerson from "../view/ViewDetails/DetailPerson";
import SeasonsScreen from "../view/ViewDetails/SeasonScreen";
import { colors } from "../../globalStyles";

const SearchStack = createStackNavigator();

const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator
      screenOptions={(navigation, route) => {
        // console.log("SearchScreenStack", navigation.route, route);
      }}
    >
      <SearchStack.Screen
        name="Search"
        component={SearchScreen}
        options={({ navigation, route }) => {
          return {
            headerTintColor: colors.darkText,
            headerStyle: {
              backgroundColor: colors.navHeaderColor,
            },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} color={colors.darkText} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
      <SearchStack.Screen name="DetailsFromSearch" component={ViewDetails} />
      <SearchStack.Screen name="DetailsFromSearchPerson" component={DetailPerson} />
      <SearchStack.Screen
        name="DetailsFromSearchSeasons"
        options={{ headerTintColor: "#274315", title: "" }}
        component={SeasonsScreen}
      />
    </SearchStack.Navigator>
  );
};

export default SearchStackScreen;
