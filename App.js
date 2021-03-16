import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { HoldMenuProvider } from "react-native-hold-menu";

import { overmind } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";
import { LogBox } from "react-native";
const envData = require("./env.json");

import RootNav from "./src/navigation/RootNav";

// export const AuthContext = React.createContext();

const App = () => {
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

  initTMDB(envData.tmdbId);
  // const overmind = createOvermind(config, { devtools: "192.168.1.7:3031" });
  // const overmind = createOvermind(config);
  return (
    <Provider value={overmind}>
      <HoldMenuProvider theme={"light"}>
        <NavigationContainer>
          <RootNav />
        </NavigationContainer>
      </HoldMenuProvider>
    </Provider>
  );
};

export default App;
