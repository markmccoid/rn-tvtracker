import React from "react";
import { Button, TouchableOpacity, Settings } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon, HomeIcon, CloseIcon } from "../../components/common/Icons";

import SettingsScreen from "./SettingsScreen";
import CreateSavedFilterScreen from "./CreateSavedFilterScreen";
import AppDebugScreen from "./AppDebugScreen";
import AppBackupScreen from "./AppBackupScreen";
import { colors } from "../../globalStyles";

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
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.navigate("ViewTVShows")}>
                  <HomeIcon size={30} color={colors.darkText} style={{ marginRight: 10 }} />
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
      <SettingsStack.Screen name="SettingsAppDebug" component={AppDebugScreen} />
      <SettingsStack.Screen name="SettingsAppBackup" component={AppBackupScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackScreen;
