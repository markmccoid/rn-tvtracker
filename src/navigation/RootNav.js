import React from "react";
import { View, Text, Button } from "react-native";
// import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from "react-native-screens";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

import { useOState } from "../store/overmind";

import AuthNav from "./AuthNav";
import AppNav from "./AppNav";
enableScreens();

// const RootStack = createStackNavigator();
const RootStack = createNativeStackNavigator();

const RootNav = () => {
  let state = useOState();
  let { isLoggedIn } = state.oAdmin;

  return (
    // <RootStack.Navigator headerMode="none">
    <RootStack.Navigator>
      {!isLoggedIn ? (
        <RootStack.Screen
          name="AuthNav"
          component={AuthNav}
          options={{ animationEnabled: true, headerShown: false }}
        />
      ) : (
        <RootStack.Screen
          name="AppNav"
          component={AppNav}
          options={{
            headerShown: false,
            animationEnabled: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default RootNav;
