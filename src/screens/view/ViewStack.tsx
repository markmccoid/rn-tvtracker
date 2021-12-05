import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { createNativeStackNavigator } from "react-native-screens/native-stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { useOState, useOActions } from "../../store/overmind";

import { FilterIcon, MenuIcon } from "../../components/common/Icons";
import { Badge } from "react-native-elements";

import ViewTVShowsScreen from "./ViewTVShows/ViewTVShowsScreen";
import ViewTVShowsFilterScreen from "./ViewTVShows/ViewTVShowsFilterScreen";
import ViewDetails from "./ViewDetails/ViewDetails";
import DetailPerson from "./ViewDetails/DetailPerson";
import SeasonsScreen from "./ViewDetails/SeasonScreen";
import { colors } from "../../globalStyles";
// @types imports
import { ViewTVStackParamList, ViewTVShowsParamList } from "./viewTypes";
import AnimatedPickImage from "./ViewDetails/AnimatedPickImage";
import EpisodeScreen from "./ViewDetails/EpisodeScreen";

const ViewStack = createNativeStackNavigator<ViewTVStackParamList>();
const ViewTVShowsStackNav = createNativeStackNavigator<ViewTVShowsParamList>();
const ViewTVDetailsStackNav = createNativeStackNavigator();
const ViewSeasonDetailsStackNav = createNativeStackNavigator();

const ViewSeasonDetailsStack = () => {
  return (
    <ViewSeasonDetailsStackNav.Navigator
      initialRouteName="DetailsSeasons"
      screenOptions={{
        stackAnimation: "default",
        stackPresentation: "modal",
      }}
    >
      <ViewSeasonDetailsStackNav.Screen
        name="DetailsSeasons"
        component={SeasonsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewSeasonDetailsStackNav.Screen
        name="DetailsSeasonsEpisode"
        component={EpisodeScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewSeasonDetailsStackNav.Screen
        name="DetailsSeasonsEpisodePerson"
        component={DetailPerson}
        options={{
          headerShown: false,
        }}
      />
    </ViewSeasonDetailsStackNav.Navigator>
  );
};

const ViewTVShowsModalStack = () => {
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
      <ViewTVShowsStackNav.Screen
        name="ViewStackSeasons"
        component={SeasonsScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewTVShowsStackNav.Screen
        name="ViewStackSeasonsEpisode"
        component={EpisodeScreen}
        options={{
          headerShown: false,
        }}
      />
      <ViewTVShowsStackNav.Screen
        name="ViewStackSeasonsEpisodePerson"
        component={DetailPerson}
        options={{
          headerShown: false,
        }}
      />
    </ViewTVShowsStackNav.Navigator>
  );
};

const ViewTVDetailsStack = () => {
  return (
    <ViewTVDetailsStackNav.Navigator
      initialRouteName="Details"
      screenOptions={{
        stackAnimation: "default",
        stackPresentation: "modal",
      }}
      // mode="modal"
      // headerMode="none"
      // params="Details"
    >
      <ViewTVDetailsStackNav.Screen
        name="Details"
        component={ViewDetails}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerBackTitle: "Back",
            headerTintColor: colors.darkText,
            headerRight: () => {
              return null;
            },
          };
        }}
      />
      <ViewTVDetailsStackNav.Screen
        name="DetailsSeasonsMain"
        component={ViewSeasonDetailsStack}
        options={{
          headerShown: false,
        }}
      />
      <ViewTVDetailsStackNav.Screen
        name="DetailsPickImage"
        component={AnimatedPickImage}
        options={{
          headerShown: false,
        }}
      />
    </ViewTVDetailsStackNav.Navigator>
  );
};
const ViewStackScreen = () => {
  const state = useOState();
  const actions = useOActions();
  // Check for deep link
  let numGenreFilters = state.oSaved.filterData.genres.length;
  let numTVShows = state.oSaved.getFilteredTVShows.length;
  let numIncludeFilters = state.oSaved.filterData.tags.length;
  let numExcludeFilters = state.oSaved.filterData.excludeTags.length;
  const isGenreFiltered = numGenreFilters > 0;
  const { clearFilterScreen } = actions.oSaved;

  //-- will respond to deep links when app was closed
  //-- Since there is an Auth layer, the intial try to go to
  //-- route doesn't work.  In app.js, the deep link is stored
  //-- in overmind.  It is cleared and then navigated to.
  const deepLink = state.oAdmin.appState?.deepLink;
  React.useEffect(() => {
    if (deepLink) {
      Linking.openURL(deepLink);
      actions.oAdmin.setDeepLink(undefined);
    }
  }, [deepLink]);

  return (
    <ViewStack.Navigator>
      <ViewStack.Screen
        name="ViewTVShows"
        component={ViewTVShowsModalStack}
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
          // let title = currentScreenName === "TVShowsScreen" ? `${numTVShows} TV Shows` : "Set Filter";
          return {
            // Found that the "title" property was not updated often enough, not sure when it was updated
            // headerCenter seems to be more reliable
            headerStyle: {
              backgroundColor: colors.navHeaderColor,
            },
            headerCenter: () => (
              <Text
                style={{ color: colors.darkText, fontSize: 16, fontWeight: "600" }}
              >{`${numTVShows} TV Shows`}</Text>
            ),
            headerLeft: () => {
              if (currentScreenName === "TVShowsScreen") {
                return (
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MenuIcon size={30} color={colors.darkText} style={{ marginLeft: -10 }} />
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
                      <FilterIcon
                        color={colors.darkText}
                        size={30}
                        style={{ marginRight: 15 }}
                      />
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
        name="DetailsModal"
        component={ViewTVDetailsStack}
        options={({ navigation, route }) => {
          return {
            // title: "",
            headerShown: false,
            // headerBackTitle: "Back",
            // headerTintColor: "#274315",
            // headerRight: () => {
            //   return null;
            // },
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
      <ViewStack.Screen
        name="DetailsPerson"
        options={{ headerTintColor: "#274315", title: "" }}
        component={DetailPerson}
      />
      {/* <ViewStack.Screen
        name="DetailsSeasons"
        options={{
          headerTintColor: "#274315",
          title: "",
          // , headerBackTitle: "Back"
        }}
        component={SeasonsScreen}
      /> */}
    </ViewStack.Navigator>
  );
};

export default ViewStackScreen;
