import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import { useOState, useOActions } from "../../store/overmind";

import { FilterIcon, CloseIcon, MenuIcon, SearchIcon } from "../../components/common/Icons";
import { Badge } from "react-native-elements";

import ViewTVShowsScreen from "./ViewTVShows/ViewTVShowsScreen";
import ViewTVShowsFilterScreen from "./ViewTVShows/ViewTVShowsFilterScreen";
import ViewDetails from "./ViewDetails/ViewDetails";
import DetailPerson from "./ViewDetails/DetailPerson";
import DetailSeasonsScreen from "./ViewDetails/DetailSeasonsScreen";
import { colors } from "../../globalStyles";
// @types imports
import { ViewTVStackParamList, ViewTVShowsParamList } from "./viewTypes";

const ViewStack = createNativeStackNavigator<ViewTVStackParamList>();
const ViewTVShowsStackNav = createNativeStackNavigator<ViewTVShowsParamList>();

const ViewTVShowsStack = () => {
  return (
    <ViewTVShowsStackNav.Navigator
      initialRouteName="TVShowsScreen"
      screenOptions={{
        stackAnimation: "default",
        stackPresentation: "modal",
      }}
      // mode="modal"
      // headerMode="none"
      // params="TVShowsScreen"
    >
      <ViewTVShowsStackNav.Screen
        name="TVShowsScreen"
        component={ViewTVShowsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewTVShowsStackNav.Screen
        name="Filter"
        component={ViewTVShowsFilterScreen}
        options={{
          headerShown: false,
        }}
      />
    </ViewTVShowsStackNav.Navigator>
  );
};

const ViewStackScreen = () => {
  const state = useOState();
  const actions = useOActions();
  let numGenreFilters = state.oSaved.filterData.genres.length;
  let numMovies = state.oSaved.getFilteredTVShows.length;
  let numIncludeFilters = state.oSaved.filterData.tags.length;
  let numExcludeFilters = state.oSaved.filterData.excludeTags.length;
  const isGenreFiltered = numGenreFilters > 0;
  const { clearFilterScreen } = actions.oSaved;

  return (
    <ViewStack.Navigator>
      <ViewStack.Screen
        name="ViewTVShows"
        component={ViewTVShowsStack}
        options={({ navigation, route }) => {
          // If the focused route is not found, we need to assume it's the initial screen
          // This can happen during if there hasn't been any navigation inside the screen
          // In our case, it's "Feed" as that's the first screen inside the navigator
          const currentScreenName = getFocusedRouteNameFromRoute(route) ?? "TVShowsScreen";

          // const movieIndex = route?.state?.routeNames?.indexOf("TVShowsScreen");
          // let movieKey;
          // if (movieIndex >= 0) {
          //   movieKey = route?.state?.routes[movieIndex]?.key;
          // }
          // let title = currentScreenName === "TVShowsScreen" ? `${numMovies} Movies` : "Set Filter";
          return {
            title: "TVShowsScreen",
            // Found that the "title" property was not updated often enough, not sure when it was updated
            // headerCenter seems to be more reliable
            headerStyle: {
              backgroundColor: colors.navHeaderColor,
            },
            headerCenter: () => (
              <Text
                style={{ fontSize: 16, fontWeight: "600" }}
              >{`${numMovies} TV Shows`}</Text>
            ),
            headerLeft: () => {
              if (currentScreenName === "TVShowsScreen") {
                return (
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MenuIcon size={30} style={{ marginLeft: 10 }} />
                  </TouchableOpacity>
                );
              }
            },
            headerRight: () => {
              if (currentScreenName === "TVShowsScreen") {
                return (
                  <View style={{ flexDirection: "row" }}>
                    {/* <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("TVShowsScreen", {
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
                        // navigation.navigate("TVShowsScreen", {
                        //   filterModified: true,
                        // });
                      }}
                    >
                      <FilterIcon color="black" size={30} style={{ marginRight: 15 }} />
                      {numIncludeFilters > 0 && (
                        <Badge
                          status="success"
                          value={numIncludeFilters}
                          containerStyle={{
                            position: "absolute",
                            top: -5,
                            right: 10,
                          }}
                        />
                      )}
                      {numExcludeFilters > 0 && (
                        <Badge
                          status="error"
                          value={numExcludeFilters}
                          containerStyle={{
                            position: "absolute",
                            top: 15,
                            left: 5,
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
                //   // onPress={() => navigation.navigate("TVShowsScreen", { returning: true })}
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
      <ViewStack.Screen name="DetailPerson" component={DetailPerson} />
      <ViewStack.Screen name="DetailSeasons" component={DetailSeasonsScreen} />
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
