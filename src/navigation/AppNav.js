import React from 'react';
import { View, Text, ActivityIndicator, ImageBackground } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';

//Remove if moving tag building elsewhere (should be action to pull stored this just for testing)
import { useOvermind } from '../store/overmind';

import Firebase from '../storage/firebase';
import ViewStack from '../screens/view/ViewStack';
import SearchStack from '../screens/search/SearchStack';
import TagStack from '../screens/tags/TagStack';

import { ViewMovieIcon, SearchIcon, TagIcon } from '../components/common/Icons';

import SettingsStackScreen from '../screens/settings/SettingsStack';
import AppNavDrawerContent from './AppNavDrawerContent';
//----------------------------------------------------------------
// Create screenoptions function for TabsNavigator
//----------------------------------------------------------------
const tabsScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconComponent;
    let tagStyle = { marginTop: 5 };
    switch (route.name) {
      case 'ViewMoviesTab':
        iconComponent = (
          <ViewMovieIcon size={size} color={color} style={tagStyle} />
        );
        break;
      case 'Search':
        iconComponent = (
          <SearchIcon size={size} color={color} style={tagStyle} />
        );
        break;
      case 'Tags':
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
    navigation.navigate('ViewMoviesTab', {
      screen: 'ViewMovies',
      params: { screen: 'Filter', forgotParam: 'shit' },
    });
  });

  return null;
};
//-- Main application Bottom Tabs ----------
const AppTabs = createBottomTabNavigator();
const AppTabsScreen = () => {
  return (
    <AppTabs.Navigator
      initialRouteName="ViewMoviesTab"
      screenOptions={tabsScreenOptions}
    >
      <AppTabs.Screen
        name="ViewMoviesTab"
        component={ViewStack}
        options={{ title: 'View Movies' }}
      />
      <AppTabs.Screen name="Search" component={SearchStack} />
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
      <Drawer.Screen name="<" component={AppTabsScreen} />
      <Drawer.Screen name="Settings" component={SettingsStackScreen} />
      {/* <Drawer.Screen name="Home" component={RedirectToMain} />
      <Drawer.Screen name="Settings" component={SettingsStackScreen} /> */}
    </Drawer.Navigator>
  );
};

export default AppNav;
