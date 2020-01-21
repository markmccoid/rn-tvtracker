import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import MainMovieStack from "./MainMovieStack";

// Drawer Navigator
const ViewMovieDrawerNavigator = createDrawerNavigator({
  ALL: {
    screen: MainMovieStack,
    navigationOptions: {
      drawerIcon: ({ tintColor }) => (
        <Ionicons name="md-home" style={{ color: tintColor }} />
      ),
      drawerLabel: "HomeAll"
    }
  },
  Favorites: {
    screen: MainMovieStack,
    navigationOptions: ({ navigation }) => {
      return {
        params: { folder: "favs" },
        drawerIcon: ({ tintColor }) => (
          <Ionicons name="ios-heart" style={{ color: tintColor }} />
        ),
        drawerLabel: "Favorites"
      };
    }
  }
});

export default ViewMovieDrawerNavigator;
