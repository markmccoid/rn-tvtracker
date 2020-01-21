import React from "react";
import { TouchableOpacity } from "react-native";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
// import SearchScreen from "../screens/SearchScreen.js";
import SearchStack from "../navigators/SearchStack";

import TagTabNavigator from "../navigators/TagTabNavigator";
import TagScreen from "../screens/TagScreen";
import TagStack from "../navigators/TagStack";
import MainMovieStack from "../navigators/MainMovieStack";
import ViewMovieDrawer from "../navigators/ViewMovieDrawer";

const MainTabNavigator = createBottomTabNavigator({
  ViewMovies: {
    screen: MainMovieStack, //ViewMovieDrawer
    navigationOptions: ({ navigation }) => {
      // console.log(
      //   "home tab nav",
      //   navigation.state.routes[navigation.state.index]
      // );

      return {
        tabBarLabel: "View Movies",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="movie"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  },
  Search: {
    screen: SearchStack,
    navigationOptions: ({ navigation }) => {
      // console.log(
      //   "in searchStack",
      //   navigation
      //   // navigation.state.routes[navigation.state.index]
      // );
      console.log("isfocused", navigation.isFocused());
      return {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons
            name="search"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  },
  Tags: {
    screen: TagTabNavigator,
    navigationOptions: ({ navigation }) => {
      // console.log(
      //   "in TagStack",
      //   navigation.state
      //   // navigation.state.routes[navigation.state.index]
      // );
      return {
        tabBarVisible: !navigation.isFocused(),
        tabBarLabel: "Tags",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome
            name="tags"
            color={tintColor}
            size={24}
            style={{ marginTop: 5 }}
          />
        )
      };
    }
  }
});

export default MainTabNavigator;
