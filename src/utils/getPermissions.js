import * as Notifications from "expo-notifications";

//------------
//! Thinking that I need to store the finalStatus returned from this function
//! to the Overmind store (oAdmin.noficationPermission: boolean)
export const askNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return false;
  }
  return true;
};
