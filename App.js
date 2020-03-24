import React from "react";
import { createAppContainer } from "react-navigation";
import { YellowBox } from "react-native";
import { initTMDB } from "tmdb_api";
import { config } from "./src/store/overmind";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import NavigationService from "./src/navigators/NavigationService";

// import MainTabNavigator from "./src/navigators/MainTabNavigator";
import AppSwitchNavigator from "./src/navigators/AppSwitchNavigator";

//import "./src/storage/firebase";

const App = createAppContainer(AppSwitchNavigator);
// suppress require cycle warning coming from tmdb_api package
YellowBox.ignoreWarnings(["Require cycle:"]);
export default () => {
  //Initialize tmdb library
  initTMDB("0e4935aa81b04539beb687d04ff414e3");
  const overmind = createOvermind(config, { devtools: "192.168.1.12:3031" });

  return (
    <Provider value={overmind}>
      <App
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Provider>
  );
};
