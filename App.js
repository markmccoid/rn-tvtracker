import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import { config } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";
import { LogBox } from "react-native";

import RootNav from "./src/navigation/RootNav";

// export const AuthContext = React.createContext();

const App = () => {
  // LogBox.ignoreLogs([
  //   "Non-serializable values were found in the navigation state"
  // ]);
  // console.log("InApp");
  initTMDB("0e4935aa81b04539beb687d04ff414e3");
  const overmind = createOvermind(config, { devtools: "192.168.1.13:3031" });
  return (
    <Provider value={overmind}>
      <NavigationContainer>
        <RootNav />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
