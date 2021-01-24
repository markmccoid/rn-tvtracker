import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import { config } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";
import { LogBox } from "react-native";
const envData = require("./env.json");

import RootNav from "./src/navigation/RootNav";

// export const AuthContext = React.createContext();

const App = () => {
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
  // console.log("InApp");
  initTMDB(envData.tmdbId);
  const overmind = createOvermind(config, { devtools: "192.168.1.20:3031" });
  // const overmind = createOvermind(config);
  return (
    <Provider value={overmind}>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
