import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useOvermind } from '../store/overmind';

import AuthNav from './AuthNav';
import AppNav from './AppNav';

const RootStack = createStackNavigator();

const RootNav = () => {
  let { state } = useOvermind();
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
