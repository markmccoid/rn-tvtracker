import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

export const sendNotificationImmediately = async (tvShowId) => {
  const url = Linking.createURL(`/details/${tvShowId}`);
  // const triggerDate = new Date(Date.now());
  // triggerDate.setMinutes(triggerDate.getMinutes() + 5);
  let notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${tvShowId}`,
      body: `New Episode for ${tvShowId}`,
      data: { url },
    },
    trigger: {
      seconds: 15,
    },
  });

  //console.log(notificationId); // can be saved in AsyncStorage or send to server
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  tvShowId: number,
  triggerDate: Date,
  hourToSend?: number
) => {
  const url = Linking.createURL(`/details/${tvShowId}`);
  if (hourToSend) {
    triggerDate.setHours(hourToSend);
  }

  let notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { url },
    },
    trigger: triggerDate,
  });

  // console.log(notificationId); // can be saved in AsyncStorage or send to server
};
