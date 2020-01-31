import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import SignInScreen from "../screens/AuthScreens/SignInScreen";
import SignUpScreen from "../screens/AuthScreens/SignUpScreen";
import ForgotPasswordScreen from "../screens/AuthScreens/ForgotPasswordScreen";

const AuthStack = createStackNavigator({
  SignIn: {
    screen: SignInScreen
  },
  SignUp: {
    screen: SignUpScreen
  },
  ForgotPassword: {
    screen: ForgotPasswordScreen
  }
});

export default AuthStack;
