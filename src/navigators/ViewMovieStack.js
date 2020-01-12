import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import ViewMovieScreen from "../screens/ViewMovieScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";

const ViewMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieScreen,
      params: { folder: "all" },
      navigationOptions: ({ navigation }) => {
        return {
          title: "View Movies"
        };
      }
    },
    MovieDetail: {
      screen: MovieDetailScreen
    }
  },
  {
    initialRouteName: "ViewMovies"
  }
);

export default ViewMovieStack;
