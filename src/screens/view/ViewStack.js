import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { useOState, useOActions } from "../../store/overmind";

import {
  FilterIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "../../components/common/Icons";
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
  const state = useOState();
  const actions = useOActions();
  let numFilters = state.oSaved.filterData.tags.length;
  let numGenreFilters = state.oSaved.filterData.genres.length;
  let numMovies = state.oSaved.getFilteredMovies().length;
  let isFiltered = numFilters > 0;
  const isGenreFiltered = numGenreFilters > 0;

  const { clearFilterScreen } = actions.oSaved;
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
          let paramShowSearch = params?.showSearch || false;
          let title =
            currentScreenName === "Movies"
              ? `${numMovies} Movies`
              : "Set Filter";
          return {
            title: title,
            headerLeft: () => {
              if (currentScreenName === "Movies") {
                return (
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MenuIcon size={30} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                );
              }
            },
            headerRight: () => {
              if (currentScreenName === "Movies") {
                return (
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Movies", {
                          showSearch: !paramShowSearch,
                        })
                      }
                    >
                      <SearchIcon
                        color={paramShowSearch ? "green" : "black"}
                        size={30}
                        style={{ marginRight: 15 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Filter")}
                      onLongPress={() => clearFilterScreen()}
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
                      {isGenreFiltered && (
                        <Badge
                          status="primary"
                          value={numGenreFilters}
                          containerStyle={{
                            position: "absolute",
                            top: -5,
                            left: -5,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
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
          // Using optional chaining because initial route object is for stack
          let currentScreenName =
            route?.state?.routeNames[route.state.index] || "Details";
          return {
            headerRight: () => {
              return null;
            },
            // headerLeft: () => {
            //   return (
            //     <TouchableOpacity onPress={() => navigation.openDrawer()}>
            //       <MenuIcon size={30} style={{ marginLeft: 10 }} />
            //     </TouchableOpacity>
            //   );
            // },
          };
        }}
      />
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
