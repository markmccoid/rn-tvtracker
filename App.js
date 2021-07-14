import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { HoldMenuProvider } from "react-native-hold-menu";
import FeatherIcon from "react-native-vector-icons/Feather";

import * as Linking from "expo-linking";

import { overmind } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";
import { LogBox } from "react-native";

import RootNav from "./src/navigation/RootNav";
import { colors } from "./src/globalStyles";

// export const AuthContext = React.createContext();
const prefix = Linking.createURL("/");

const App = () => {
  const linking = {
    prefixes: [prefix, "tvtracker://"],
    config: {
      screens: {
        AppNav: {
          screens: {
            Home: {
              screens: {
                // Search: "search/:title",
                SearchStack: {
                  screens: {
                    Search: {
                      path: "search/:name",
                      parse: {
                        //right now just dealing with spaces in names
                        name: (name) => name.replace(/%20/g, " "),
                      },
                    },
                  },
                },
                Tags: "tags",
              },
            },
          },
        },
      },
    },
  };
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

  // const handleDeepLink = (event) => {
  //   setData(Linking.parse(event.url));
  //   // console.log("event", Linking.parse(event.url));
  // };
  // useEffect(() => {
  //   async function getInitialURL() {
  //     const initialURL = await Linking.getInitialURL();
  //     if (initialURL) {
  //       setData(Linking.parse(initialURL));
  //       // console.log("INITIAL", Linking.parse(initialURL));
  //     }
  //   }

  //   Linking.addEventListener("url", handleDeepLink);
  //   if (!data) {
  //     getInitialURL();
  //   }
  //   return () => {
  //     Linking.removeEventListener("url");
  //   };
  // }, []);

  // initTMDB(envData.tmdbId);
  // const overmind = createOvermind(config, { devtools: "192.168.1.7:3031" });
  // const overmind = createOvermind(config);
  return (
    <Provider value={overmind}>
      <HoldMenuProvider iconComponent={FeatherIcon} theme="light">
        <NavigationContainer linking={linking}>
          <RootNav />
        </NavigationContainer>
      </HoldMenuProvider>
    </Provider>
  );
};

export default App;
