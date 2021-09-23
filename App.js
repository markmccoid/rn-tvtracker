import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "overmind-react";
import { HoldMenuProvider } from "react-native-hold-menu";
import * as Notifications from "expo-notifications";
import FeatherIcon from "react-native-vector-icons/Feather";

import * as Linking from "expo-linking";

import { askNotificationPermissions } from "./src/utils/getPermissions";
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
                ViewTVShowsTab: {
                  screens: {
                    DetailsModal: {
                      screens: {
                        Details: {
                          path: "details/:tvShowId",
                          parse: {
                            //make sure passed value is an integer
                            tvShowId: (tvShowId) => parseInt(tvShowId),
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    async getInitialURL() {
      // First, you may want to do the default deep link handling
      // Check if app was opened from a deep link
      let url = await Linking.getInitialURL();
      if (url != null) {
        return url;
      }

      // Handle URL from expo push notifications
      const response = await Notifications.getLastNotificationResponseAsync();
      url = response?.notification.request.content.data.url;
      // Store the url in overmind.  Will check it in AppNav
      overmind.actions.oAdmin.setDeepLink(url);
      return url;
    },
    subscribe(listener) {
      const onReceiveURL = ({ url }) => listener(url);

      // Listen to incoming links from deep linking
      Linking.addEventListener("url", onReceiveURL);

      // Listen to expo push notifications
      const subscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const url = response.notification.request.content.data.url;
          // Any custom logic to see whether the URL needs to be handled
          //...

          overmind.actions.oAdmin.setDeepLink(url);
          Linking.openURL(url);
          // Let React Navigation handle the URL
          listener(url);
        }
      );

      return () => {
        // Clean up the event listeners
        Linking.removeEventListener("url", onReceiveURL);
        subscription.remove();
      };
    },
  };
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

  // const lastNotificationResponse = Notifications.useLastNotificationResponse();
  // React.useEffect(() => {
  //   if (
  //     lastNotificationResponse &&
  //     lastNotificationResponse.notification.request.content.data.url &&
  //     lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
  //   ) {
  //     Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
  //     console.log(
  //       "lastNotificationreposnse",
  //       lastNotificationResponse.notification.request.content.data.url
  //     );
  //   }
  // }, [lastNotificationResponse]);

  // useEffect(() => {
  //   askNotificationPermissions();
  // }, []);

  // initTMDB(envData.tmdbId); // Now in Overmind's onInitialize.js

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
