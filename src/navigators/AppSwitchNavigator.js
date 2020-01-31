import { createSwitchNavigator } from "react-navigation";
import MainTabNavigator from "./MainTabNavigator";
import AuthLoadingScreen from "../screens/AuthScreens/AuthLoadingScreen";
import AuthStack from "./AuthStack";

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: MainTabNavigator,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading"
  }
);
