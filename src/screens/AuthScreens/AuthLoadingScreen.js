import React, { useEffect } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
// import { useOvermind } from "../../store/overmind";
// import Firebase from "../../storage/firebase";

const AuthLoadingScreen = ({ navigation }) => {
  // const { state, actions } = useOvermind();

  // useEffect(() => {
  //   console.log(Firebase.auth().currentUser);
  //   console.log("PARAM", navigation.getParam("user"));
  //   if (Firebase.auth().currentUser) {
  //     actions.oAdmin.logUserIn(Firebase.auth().currentUser);
  //     navigation.navigate("App");
  //   }
  // }, [Firebase.auth().currentUser]);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
    </View>
  );
};

export default AuthLoadingScreen;
