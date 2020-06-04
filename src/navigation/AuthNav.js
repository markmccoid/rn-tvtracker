import React from 'react';
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';

import SignIn from '../screens/auth/SignIn';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const AuthStack = createStackNavigator();

const AuthNav = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ title: 'Sign In', animationTypeForReplace: 'pop' }}
        initialParams={{
          screenFunction: 'signin',
        }}
      />
      <AuthStack.Screen
        name="CreateAccount"
        component={SignIn}
        options={{
          title: 'Create Account',
          animationTypeForReplace: 'pop',
        }}
        initialParams={{ screenFunction: 'create' }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
          animationTypeForReplace: 'pop',
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthNav;
