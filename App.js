import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import { config } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";

import { Alert } from "react-native";
import RootNav from "./src/navigation/RootNav";

export const AuthContext = React.createContext();

const App = () => {
  initTMDB("0e4935aa81b04539beb687d04ff414e3");
  const overmind = createOvermind(config, { devtools: "192.168.1.3:3031" });
  return (
    <Provider value={overmind}>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
