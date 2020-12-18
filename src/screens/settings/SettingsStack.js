import React from "react";
import { Button, TouchableOpacity, Settings } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon, HomeIcon, CloseIcon } from "../../components/common/Icons";

import SettingsScreen from "./SettingsScreen";
import CreateSavedFilterScreen from "./CreateSavedFilterScreen";

const SettingsStack = createStackNavigator();

const SettingsStackScreen = () => {
  //NOTE: - I have set this as model so that other screens (currently just "Create Saved Filter") open up as model
  // -- if you have some screens you don't want to be model then you will need to embed another Stack within
  // -- i.e. the main "Settings" screen will be a stack.
  return (
    <SettingsStack.Navigator screenOptions={{ animationEnabled: false }} mode="modal">
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => {
          return {
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate("ViewMovies")}>
                  <HomeIcon size={30} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
      <SettingsStack.Screen
        name="CreateSavedFilter"
        component={CreateSavedFilterScreen}
        options={({ navigation, route }) => {
          return {
            animationEnabled: true,
            title: "Create Saved Filter",
            headerLeft: () => {
              return null;
            },
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
                  <CloseIcon color="black" size={30} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackScreen;
