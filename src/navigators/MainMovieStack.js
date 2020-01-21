import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import { Badge } from "react-native-elements";
import ViewMovieScreen from "../screens/ViewMovieScreen";
import ViewMoviesFilterScreen from "../screens/ViewMoviesFilterScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";
import MovieDetailTagEditScreen from "../screens/MovieDetailTagEditScreen";

const ViewMovieStack = createStackNavigator(
  {
    ViewMoviesScreen: {
      screen: ViewMovieScreen,
      navigationOptions: ({ navigation }) => {
        return {
          headerRight: (
            <TouchableOpacity
              onPress={() => navigation.navigate("ViewMoviesFilter")}
            >
              <AntDesign name="close" size={30} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          )
        };
      }
    },
    ViewMoviesFilter: {
      screen: ViewMoviesFilterScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const ViewMovieDetailStack = createStackNavigator(
  {
    MovieDetailScreen: {
      screen: MovieDetailScreen,
      navigationOptions: ({ navigation }) => {
        console.log("MOVIE STACK PARAMS", navigation.state.params);
      }
    },
    MovieDetailTagEdit: {
      screen: MovieDetailTagEditScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);
const MainMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieStack,
      navigationOptions: ({ navigation }) => {
        let params = navigation.state.routes[navigation.state.index].params;
        let routeName =
          navigation.state.routes[navigation.state.index].routeName;
        //console.log("PARAMS", params);
        let isFiltered = params ? params.isFiltered : false;
        let numFilters = params ? params.numFilters : undefined;
        console.log(
          "MOVIE TAB NAV",
          navigation.state.routes,
          navigation.state.index
        );
        // console.log(
        //   "MOVIE TAB PARAMS",
        //   navigation.state.routes[navigation.state.index].params
        // );
        return {
          title: "View Movies",
          headerRight: () => {
            if (routeName === "ViewMoviesFilter") {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewMoviesScreen")}
                >
                  <AntDesign
                    name="close"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ViewMoviesFilter")}
                >
                  <Feather
                    name="filter"
                    size={30}
                    style={{
                      marginRight: 15,
                      color: isFiltered ? "green" : "black"
                    }}
                  />
                  {numFilters ? (
                    <Badge
                      status="success"
                      value={numFilters}
                      containerStyle={{
                        position: "absolute",
                        top: -5,
                        right: 10
                      }}
                    />
                  ) : null}
                </TouchableOpacity>
              );
            }
          }
        };
      }
    },
    MovieDetail: {
      screen: ViewMovieDetailStack,
      navigationOptions: ({ navigation }) => {
        let movie = navigation.getParam("movie");

        return {
          title: movie.title,
          headerRight: () => {
            let routeName =
              navigation.state.routes[navigation.state.index].routeName;
            if (routeName === "MovieDetailTagEdit") {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("MovieDetailScreen")}
                >
                  <AntDesign
                    name="close"
                    size={30}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>
              );
            } else {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MovieDetailTagEdit", { movie })
                  }
                >
                  <Feather name="tag" size={30} style={{ marginRight: 10 }} />
                </TouchableOpacity>
              );
            }
          }
        };
      }
    }
  },
  {
    initialRouteName: "ViewMovies"
  }
);

export default MainMovieStack;
