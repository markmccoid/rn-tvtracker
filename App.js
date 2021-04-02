import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { HoldMenuProvider } from "react-native-hold-menu";
import * as Linking from "expo-linking";

import { overmind } from "./src/store/overmind";
import { initTMDB } from "@markmccoid/tmdb_api";
import { LogBox } from "react-native";
const envData = require("./env.json");

import RootNav from "./src/navigation/RootNav";

// export const AuthContext = React.createContext();
const prefix = Linking.createURL("/");

const App = () => {
  const linking = {
    prefixes: [prefix, "movietracker://"],
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
                      path: "search/:title",
                      parse: {
                        //right now just dealing with spaces in titles
                        title: (title) => title.replace(/%20/g, " "),
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

  initTMDB(envData.tmdbId);
  // const overmind = createOvermind(config, { devtools: "192.168.1.7:3031" });
  // const overmind = createOvermind(config);
  return (
    <Provider value={overmind}>
      <HoldMenuProvider theme={"light"}>
        <NavigationContainer linking={linking}>
          <RootNav />
        </NavigationContainer>
      </HoldMenuProvider>
    </Provider>
  );
};

export default App;
