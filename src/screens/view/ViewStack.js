import React from "react";
import { Button, TouchableOpacity, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { FilterIcon, CloseIcon } from "../../components/common/Icons";
import { Badge } from "react-native-elements";

import ViewMoviesScreen from "./ViewMovies/ViewMoviesScreen";
import ViewMoviesFilterScreen from "./ViewMovies/ViewMoviesFilterScreen";
import ViewDetails from "./ViewDetails/ViewDetails";

const ViewStack = createStackNavigator();
const ViewMoviesStackNav = createStackNavigator();
const ViewMovieDetailsStackNav = createStackNavigator();

const ViewMoviesStack = () => {
  return (
    <ViewMoviesStackNav.Navigator
      mode="modal"
      headerMode="none"
      params="Movies"
    >
      <ViewMoviesStackNav.Screen name="Movies" component={ViewMoviesScreen} />
      <ViewMoviesStackNav.Screen
        name="Filter"
        component={ViewMoviesFilterScreen}
      />
    </ViewMoviesStackNav.Navigator>
  );
};
const ViewStackScreen = () => {
  return (
    <ViewStack.Navigator>
      <ViewStack.Screen
        name="ViewMovies"
        component={ViewMoviesStack}
        options={({ navigation, route }) => {
          // Using optional chaining because initial route object is for stack
          let currentScreenName =
            route?.state?.routeNames[route.state.index] || "Movies";
          let params = route?.state?.routes[route.state.index].params;

          let isFiltered = params?.isFiltered;
          let numFilters = params?.numFilters;

          return {
            title: "Movies",
            headerRight: () => {
              if (currentScreenName === "Movies") {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Filter")}
                  >
                    <FilterIcon
                      color="black"
                      size={30}
                      style={{ marginRight: 15 }}
                    />
                    {isFiltered && (
                      <Badge
                        status="success"
                        value={numFilters}
                        containerStyle={{
                          position: "absolute",
                          top: -5,
                          right: 10,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                );
              } else if (currentScreenName === "Filter") {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Movies", { returning: true })
                    }
                  >
                    <CloseIcon
                      color="black"
                      size={30}
                      style={{ marginRight: 15 }}
                    />
                  </TouchableOpacity>
                );
              }
            },
          };
        }}
      />
      <ViewStack.Screen
        name="Details"
        component={ViewDetails}
        options={({ navigation, route }) => {
          console.log("DET ROUTE", route);
          console.log("Params", route?.params);
          // Using optional chaining because initial route object is for stack
          let currentScreenName =
            route?.state?.routeNames[route.state.index] || "Details";
          return {
            headerRight: () => {
              return null;
            },
          };
        }}
      />
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
