import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { useOState, useOActions } from "../../store/overmind";

import { FilterIcon, CloseIcon, MenuIcon, SearchIcon } from "../../components/common/Icons";
import { Badge } from "react-native-elements";

import ViewMoviesScreen from "./ViewMovies/ViewMoviesScreen";
import ViewMoviesFilterScreen from "./ViewMovies/ViewMoviesFilterScreen";
import ViewDetails from "./ViewDetails/ViewDetails";
import DetailPerson from "./ViewDetails/DetailPerson";

// const ViewStack = createStackNavigator();
// const ViewMoviesStackNav = createStackNavigator();
// const ViewMovieDetailsStackNav = createStackNavigator();

const ViewStack = createNativeStackNavigator();
const ViewMoviesStackNav = createNativeStackNavigator();
const ViewMovieDetailsStackNav = createNativeStackNavigator();

enableScreens();

const ViewMoviesStack = () => {
  return (
    // <ViewMoviesStackNav.Navigator mode="modal" headerMode="none" params="Movies">
    <ViewMoviesStackNav.Navigator
      initialRouteName="Movies"
      screenOptions={{
        stackAnimation: "default",
        stackPresentation: "modal",
      }}
      // mode="modal"
      // headerMode="none"
      // params="Movies"
    >
      <ViewMoviesStackNav.Screen
        name="Movies"
        component={ViewMoviesScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewMoviesStackNav.Screen
        name="Filter"
        component={ViewMoviesFilterScreen}
        options={{
          headerShown: false,
        }}
      />
    </ViewMoviesStackNav.Navigator>
  );
};

const ViewStackScreen = () => {
  const state = useOState();
  const actions = useOActions();
  let numFilters = state.oSaved.getFilterTags.length; //state.oSaved.filterData.tags.length;
  let numGenreFilters = state.oSaved.filterData.genres.length;
  let numMovies = state.oSaved.getFilteredMovies().length;
  let isFiltered = numFilters > 0;
  const isGenreFiltered = numGenreFilters > 0;
  const { clearFilterScreen } = actions.oSaved;

  return (
    <ViewStack.Navigator initialRouteName="Movies">
      <ViewStack.Screen
        name="ViewMovies"
        component={ViewMoviesStack}
        options={({ navigation, route }) => {
          // If the focused route is not found, we need to assume it's the initial screen
          // This can happen during if there hasn't been any navigation inside the screen
          // In our case, it's "Feed" as that's the first screen inside the navigator
          const currentScreenName = getFocusedRouteNameFromRoute(route) ?? "Movies";

          // const movieIndex = route?.state?.routeNames?.indexOf("Movies");
          // let movieKey;
          // if (movieIndex >= 0) {
          //   movieKey = route?.state?.routes[movieIndex]?.key;
          // }
          // let title = currentScreenName === "Movies" ? `${numMovies} Movies` : "Set Filter";
          return {
            // Found that the "title" property was not updated often enough, not sure when it was updated
            // headerCenter seems to be more reliable
            headerCenter: () => (
              <Text style={{ fontSize: 16, fontWeight: "600" }}>{`${numMovies} Movies`}</Text>
            ),
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
                    {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Filter")}
                      onLongPress={() => {
                        clearFilterScreen();
                        navigation.navigate("Movies", {
                          filterModified: true,
                        });
                      }}
                    >
                      <FilterIcon color="black" size={30} style={{ marginRight: 15 }} />
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
                // Used to be X button for closing filter, now, using createNativeStackNav we don't need.
                return null;
                // <TouchableOpacity
                //   // onPress={() => navigation.navigate("Movies", { returning: true })}
                //   onPress={() => navigation.goBack()}
                // >
                //   <CloseIcon color="black" size={30} style={{ marginRight: 15 }} />
                // </TouchableOpacity>
              }
            },
          };
        }}
      />
      <ViewStack.Screen
        name="Details"
        component={ViewDetails}
        options={({ navigation, route }) => {
          return {
            title: "",
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
      <ViewStack.Screen name="DetailsPerson" component={DetailPerson} />
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
