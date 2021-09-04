import React from "react";
import { Button, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon } from "../../components/common/Icons";

import SearchScreen from "./SearchScreen";
import ViewDetails from "../view/ViewDetails/ViewDetails";
import DetailPerson from "../view/ViewDetails/DetailPerson";
import SeasonsScreen from "../view/ViewDetails/SeasonScreen";
import AnimatedPickImage from "../view/ViewDetails/AnimatedPickImage";

import { colors } from "../../globalStyles";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

const SearchStack = createNativeStackNavigator();
const ModalStack = createNativeStackNavigator();
const SearchDetailsModalStack = () => {
  return (
    <ModalStack.Navigator
      initialRouteName="DetailsFromSearch"
      screenOptions={{
        stackAnimation: "default",
        // stackPresentation: "modal",
      }}
    >
      <ModalStack.Screen
        name="DetailsFromSearch"
        component={ViewDetails}
        options={{
          headerShown: true,
        }}
      />
      <ModalStack.Screen
        name="DetailsFromSearchSeasons"
        component={SeasonsScreen}
        options={{
          headerShown: false,
          stackPresentation: "modal",
        }}
      />
      <ModalStack.Screen
        name="DetailsFromSearchPickImage"
        component={AnimatedPickImage}
        options={{
          headerShown: false,
          stackPresentation: "modal",
        }}
      />
    </ModalStack.Navigator>
  );
};
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
            title: "Search",
            headerTintColor: colors.darkText,
            headerStyle: {
              backgroundColor: colors.navHeaderColor,
            },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} color={colors.darkText} style={{ marginLeft: -10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
      {/* Seasons modal goes here -- create a stack here!! */}
      <SearchStack.Screen
        name="DetailsFromSearchModal"
        component={SearchDetailsModalStack}
        options={({ navigation, route }) => {
          return {
            // title: "",
            headerShown: false,
          };
        }}
      />
      {/* <SearchStack.Screen name="DetailsFromSearch" component={ViewDetails} /> */}
      <SearchStack.Screen name="DetailsFromSearchPerson" component={DetailPerson} />
      {/* <SearchStack.Screen
        name="DetailsFromSearchSeasons"
        options={{ headerTintColor: "#274315", title: "" }}
        component={SeasonsScreen}
      /> */}
    </SearchStack.Navigator>
  );
};

export default SearchStackScreen;
