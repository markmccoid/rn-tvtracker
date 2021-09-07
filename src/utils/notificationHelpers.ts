import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

export const sendNotificationImmediately = async (tvShowName) => {
  const url = Linking.createURL(`/search/${tvShowName}`);
  // const triggerDate = new Date(Date.now());
  // triggerDate.setMinutes(triggerDate.getMinutes() + 5);
  let notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${tvShowName}`,
      body: `New Episode for ${tvShowName}`,
      data: { url },
    },
    trigger: {
      seconds: 5,
    },
  });

  //console.log(notificationId); // can be saved in AsyncStorage or send to server
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
  tvShowId: number,
  triggerDate: Date,
  hourToSend: number = 9
) => {
  const url = Linking.createURL(`/details/${tvShowId}`);
  triggerDate.setHours(hourToSend);

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
