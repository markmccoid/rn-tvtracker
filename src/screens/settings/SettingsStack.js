import React from "react";
import { Button, TouchableOpacity, View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { MenuIcon, HomeIcon, CloseIcon } from "../../components/common/Icons";

import SettingsScreen from "./SettingsScreen";
import SettingsSortScreen from "./SettingsSortScreen";
import SettingsSavedFiltersScreen from "./SettingsSavedFiltersScreen";
import CreateSavedFilterScreen from "./CreateSavedFilterScreen";
import AppDebugScreen from "./AppDebugScreen";
import AppBackupScreen from "./AppBackupScreen";
import { colors } from "../../globalStyles";

const SettingsStack = createStackNavigator();
const SettingsSavedFiltersStack = createStackNavigator();

const SettingsSavedFiltersStackScreen = () => {
  return (
    <SettingsSavedFiltersStack.Navigator
      screenOptions={{
        animationEnabled: true,
        presentation: "modal",
        headerShown: true,
      }}
    >
      <SettingsSavedFiltersStack.Screen
        name="SettingsSavedFilters"
        component={SettingsSavedFiltersScreen}
        options={({ navigation }) => {
          return {
            headerTintColor: colors.darkText,
            title: "Saved Filters",
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                    navigation.navigate("ViewTVShows");
                  }}
                >
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
            headerTintColor: colors.darkText,
            headerStyle: {
              backgroundColor: colors.buttonPrimary,
              height: 40,
              borderWidth: 1,
              borderColor: colors.commonBorder,
            },
            headerLeft: () => {
              return null;
            },
            headerRight: () => {
              return (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <CloseIcon color="black" size={30} style={{ marginRight: 15 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
    </SettingsSavedFiltersStack.Navigator>
  );
};

const SettingsStackScreen = () => {
  //NOTE: - I have set this as model so that other screens (currently just "Create Saved Filter") open up as model
  // -- if you have some screens you don't want to be model then you will need to embed another Stack within
  // -- i.e. the main "Settings" screen will be a stack.
  return (
    <SettingsStack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{
        animationEnabled: true,
        headerShown: true,
      }}
    >
      <SettingsStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={({ navigation, route }) => {
          return {
            title: "Settings",
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
        name="SettingsSavedFiltersStack"
        options={{
          headerShown: false,
        }}
        component={SettingsSavedFiltersStackScreen}
      />
      <SettingsStack.Screen
        name="SettingsMainSortStack"
        component={SettingsSortScreen}
        options={({ navigation }) => {
          return {
            headerTintColor: colors.darkText,
            title: "Show Sort Order",
            headerRight: () => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                    navigation.navigate("ViewTVShows");
                  }}
                >
                  <HomeIcon size={30} color={colors.darkText} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
      <SettingsStack.Screen
        name="SettingsAppBackup"
        component={AppBackupScreen}
        options={({ navigation, route }) => {
          return {
            animationEnabled: true,
            title: "Backup / Restore",
            headerTintColor: colors.darkText,
            // headerShown: "true",
            // headerLeft: () => {
            //   return null;
            // },
            // headerRight: () => {
            //   return (
            //     <TouchableOpacity onPress={() => navigation.goBack()}>
            //       <CloseIcon color="black" size={30} style={{ marginRight: 15 }} />
            //     </TouchableOpacity>
            //   );
            // },
          };
        }}
      />
      <SettingsStack.Screen name="SettingsAppDebug" component={AppDebugScreen} />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackScreen;
