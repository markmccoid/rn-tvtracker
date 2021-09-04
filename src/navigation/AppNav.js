import React from "react";
import { View, Text, ActivityIndicator, ImageBackground } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import Firebase from "../storage/firebase";
import ViewStack from "../screens/view/ViewStack";
import SearchStack from "../screens/search/SearchStack";
import TagStack from "../screens/tags/TagStack";

import { ViewTVShowIcon, TagIcon, AddIcon } from "../components/common/Icons";
import { colors } from "../globalStyles";

import SettingsStackScreen from "../screens/settings/SettingsStack";
import TestCarouselAnim from "../screens/view/ViewTVShows/TestCarouselAnim";
import AppNavDrawerContent from "./AppNavDrawerContent";

//----------------------------------------------------------------
// Create screenoptions function for TabsNavigator
//----------------------------------------------------------------
const tabsScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconComponent;
    let tagStyle = { marginTop: 5 };
    switch (route.name) {
      case "ViewTVShowsTab":
        iconComponent = <ViewTVShowIcon size={size} color={color} style={tagStyle} />;
        break;
      case "SearchStack":
        iconComponent = <AddIcon size={size} color={color} style={tagStyle} />;
        break;
      case "Tags":
        iconComponent = <TagIcon size={size} color={color} style={tagStyle} />;
        break;
      default:
        break;
    }

    // You can return any component that you like here!
    return <>{iconComponent}</>;
  },
});

//----------------------------------------------------------------
//--Drawer Creation
const Drawer = createDrawerNavigator();

//-- SignOut component for drawer.
//- Calls Firebase signout method, then shows activity indicator.
//- when onAuthStateChanged(store/oSaved/onInitialize.js) "reacts" user will be logged out
//- this will cause rerender and auth nav path to be displayed.
const SignOut = ({ navigation }) => {
  Firebase.auth().signOut();
  return <ActivityIndicator />;
};

//-- Redirect to View Movies screen --
const RedirectToMain = ({ navigation }) => {
  // Using the useFocusEffect, the navigation is run
  // whenever this component gets focus.
  // Currently this is from the Drawer link "Home"
  useFocusEffect(() => {
    navigation.navigate("ViewTVShowsTab", {
      screen: "ViewTVShows",
      params: { screen: "Filter" },
    });
  });

  return null;
};
//-- Main application Bottom Tabs ----------
const AppTabs = createBottomTabNavigator();

const AppTabsScreen = () => {
  return (
    <AppTabs.Navigator
      // lazy={false}
      initialRouteName="ViewTVShowsTab"
      screenOptions={tabsScreenOptions}
      tabBarOptions={{
        style: {
          backgroundColor: colors.navHeaderColor,
          borderTopWidth: 1,
          // borderTopColor: "#555",
        },
        inactiveTintColor: "gray",
        // activeBackgroundColor: colors.primary,
        // inactiveBackgroundColor: colors.background,
        activeTintColor: colors.primary,
        // inactiveBackgroundColor: colors.navHeaderColor,
      }}
    >
      <AppTabs.Screen
        name="ViewTVShowsTab"
        component={ViewStack}
        options={{
          title: "My TV",
        }}
      />
      <AppTabs.Screen
        name="SearchStack"
        component={SearchStack}
        options={{ title: "Add TV Show" }}
      />
      <AppTabs.Screen name="Tags" component={TagStack} />
    </AppTabs.Navigator>
  );
};

const AppNav = () => {
  return (
    //-- Define the Drawer screens.  HomeStack is part of bottom tabs, but settings is not.
    <Drawer.Navigator
      drawerType="front"
      drawerStyle={{}}
      drawerContent={(props) => <AppNavDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={AppTabsScreen} />
      <Drawer.Screen name="Settings" component={SettingsStackScreen} />
      <Drawer.Screen
        options={{ unmountOnBlur: true }}
        name="Carousel View"
        component={TestCarouselAnim}
      />
    </Drawer.Navigator>
  );
};

export default AppNav;
