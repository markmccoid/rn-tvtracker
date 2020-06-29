import React from 'react';
import { Button, TouchableOpacity, Settings } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuIcon } from '../../components/common/Icons';

import SettingsScreen from './SettingsScreen';
import CreateSavedFilterScreen from './CreateSavedFilterScreen';

const SettingsStack = createStackNavigator();

const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => {
          return {
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                  <MenuIcon size={30} style={{ marginLeft: 10 }} />
                </TouchableOpacity>
              );
            },
          };
        }}
      />
      <SettingsStack.Screen
        name="Create Saved Filter"
        component={CreateSavedFilterScreen}
      />
    </SettingsStack.Navigator>
  );
};

export default SettingsStackScreen;
