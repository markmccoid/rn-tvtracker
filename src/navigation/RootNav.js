import React from "react";
import { View, Text, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useOState } from "../store/overmind";

import AuthNav from "./AuthNav";
import AppNav from "./AppNav";

const RootStack = createStackNavigator();

const RootNav = () => {
  let state = useOState();
  let { isLoggedIn } = state.oAdmin;

  return (
    <RootStack.Navigator headerMode="none">
      {!isLoggedIn ? (
        <RootStack.Screen
          name="AuthNav"
          component={AuthNav}
          options={{ animationEnabled: true }}
        />
      ) : (
        <RootStack.Screen
          name="AppNav"
          component={AppNav}
          options={{
            animationEnabled: false,
          }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default RootNav;
