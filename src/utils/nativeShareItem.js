import { Share } from "react-native";

export const nativeShareItem = async ({ message, url }) => {
  try {
    const result = await Share.share({
      message,
      url,
    });
    //-------
    //- Below code can be used if you want to have some sort of
    //- callback after you have shared or dismissed the share ui
    // if (result.action === Share.sharedAction) {
    //   if (result.activityType) {
    //     // shared with activity type of result.activityType
    //     console.log("result.activitytype", result.activityType);
    //   } else {
    //     console.log("just shared", result);
    //     // shared
    //   }
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    // }
  } catch (error) {
    alert(error.message);
  }
};
