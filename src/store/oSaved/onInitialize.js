// import Firebase, { firestore } from "../../storage/firebase";
// import { loadFromAsyncStorage } from "../../storage/asyncStorage";
// import uuidv4 from "uuid/v4";
import * as Notifications from "expo-notifications";

import { askNotificationPermissions } from "../../utils/getPermissions";
import { loadCurrentUserFromStorage } from "../../storage/localData";
let envData = "";
if (process.env.NODE_ENV === "development") {
  envData = require("../../../env.json");
}
import { initTMDB } from "@markmccoid/tmdb_api";
// initialize currently only loads data that was stored in
// phones local storage.
let unsubscribe = () => {};
let undo = () => {};
export const onInitialize = async ({ state, effects, actions }) => {
  // Sets up Listener for Auth state.  If logged
  await initTMDB(
    process.env.NODE_ENV === "development" ? envData.tmdbId : process.env.TMDB_ID
  );
  // await initTMDB(envData.tmdbId);
  const notifyGranted = await askNotificationPermissions();

  await setupNotifications();
  const currentUser = await loadCurrentUserFromStorage();
  //const user = { email: "Guest User", uid: "guestuser" };
  if (currentUser?.uid) {
    actions.oAdmin.logUserIn(currentUser);
  } else {
    actions.oAdmin.logUserOut(currentUser);
  }
};

const setupNotifications = async () => {
  // const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync();
  // if (
  //   lastNotificationResponse &&
  //   lastNotificationResponse.notification.request.content.data.url &&
  //   lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
  // ) {
  //   Linking.openURL(lastNotificationResponse.notification.request.content.data.url);
  //   console.log(
  //     "lastNotificationreposnse",
  //     lastNotificationResponse.notification.request.content.data.url
  //   );
  // }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
    handleSuccess: (notificationId) => {
      // console.log("Notification came in", notificationId);
    },
    handleError: () => {
      // console.log("ERROR in notif handler");
    },
  });
};
