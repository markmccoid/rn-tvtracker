import React from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import axios from "axios";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { getAuthToken } from "../../utils/dropboxUtils";

import PressableButton from "../common/PressableButton";
import { colors } from "../../globalStyles";

// const getAuthToken = async (authKey) => {
//   const body = { code: authKey, grant_type: "authorization_code" };
//   const params = `code=${authKey}&grant_type=authorization_code`;
//   // These are my dropbox apps id and secret phrase used as username/password
//   const username = "j7nohmjf4e2o931";
//   const password = "60a7ruwn3tj4nt1";

//   const authHeader = "Basic " + base64.encode(`${username}:${password}`);
//   const data = new URLSearchParams();
//   data.append("code", authKey);
//   data.append("grant_type", "authorization_code");

//   // axios.interceptors.request.use(
//   //   (config) => {
//   //     console.log("Intercepted config", config);
//   //     return config;
//   //   },
//   //   (err) => {
//   //     console.log("Intercept Errr", err);
//   //     return Promise.reject(err);
//   //   }
//   // );
//   try {
//     const response = await axios.post(`https://api.dropbox.com/oauth2/token`, data, {
//       headers: {
//         Authorization: authHeader,
//         // ["Content-Type"]: "multipart/form-data",
//       },
//       // params: { code: authKey, grant_type: "authorization_code" },
//     });
//     console.log(response.data);
//     return response.data.access_token;
//     /* data: {
//         access_token: string;
//         account_id: string;
//         scope: string;
//         token_type: string;
//         uid: string;
//     }
//     */
//   } catch (err) {
//     console.log("error =", typeof err, err);
//     return {
//       error: err,
//     };
//   }
// };
const DropboxAuth = ({ setDropboxToken, tokenErrorMessage }) => {
  const [authKey, setAuthKey] = React.useState("");
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>Authorize TV Tracker for Dropbox</Text>
      <Text>
        Press on Dropbox button and sign in to your Dropbox account. Allow the TV Tracker app
        and copy the Authorization code displayed. Paste into input box below and press
        "Authorize"
      </Text>
      <View style={{ alignItems: "center" }}>
        <PressableButton
          style={{
            backgroundColor: colors.dropboxBlue,
            marginBottom: 10,
            alignItems: "center",
          }}
          onPress={() =>
            WebBrowser.openBrowserAsync(
              "https://www.dropbox.com/oauth2/authorize?client_id=j7nohmjf4e2o931&response_type=code"
            )
          }
        >
          <Text style={{ color: "white" }}>Go To Dropbox</Text>
        </PressableButton>
      </View>
      <TextInput
        style={styles.input}
        value={authKey}
        onChangeText={(text) => setAuthKey(text)}
        placeholder="Enter Dropbox Code"
      />
      <PressableButton
        style={{
          backgroundColor: `${colors.dropboxBlue}${!!!authKey ? "aa" : ""}`,
          marginVertical: 10,
          alignItems: "center",
        }}
        disabled={!!!authKey}
        onPress={async () => {
          const token = await getAuthToken(authKey);
          console.log("Token db auht", token.error);
          if (!token?.error) {
            setDropboxToken(token.token);
          } else {
            Alert.alert("ERROR getting Dropbox Token, Try again", token?.error);
          }
        }}
      >
        <Text style={{ color: "white" }}>Authorize</Text>
      </PressableButton>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});
export default DropboxAuth;
