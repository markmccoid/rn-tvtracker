import React from "react";
import {
  View,
  Text,
  TextInput,
  Keyboard,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button } from "../../components/common/Buttons";

import Firebase from "../../storage/firebase";

import {
  Header,
  IntroText,
  ButtonView,
  BigButton,
  ButtonText,
  PasswordInput,
} from "./authStyles";

const ForgotPasswordScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState({ type: "", message: "" });
  const emailInputRef = React.useRef();
  //---------------------------------
  // Submit is logging into Firebase
  const handleResetPassword = async (data) => {
    if (email.length <= 0) {
      setError({ type: "required", message: "Email Required" });
      return;
    }
    setIsLoading(true);
    return Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setIsLoading(false);
        navigation.navigate("SignIn");
      })
      .catch((error) => {
        setIsLoading(false);
        setError({ type: "firebase", message: error.message });
        Keyboard.dismiss();
      });
  };
  React.useEffect(() => {
    emailInputRef.current.focus();
  });
  //--- Setup second password for Create User screen

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.wrapper}>
      <Header>MovieTracker</Header>

      <View style={styles.signInWrapper}>
        {error.type === "firebase" && <Text style={styles.errorText}>{error.message}</Text>}
        <TextInput
          style={styles.inputBox}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="go"
          onSubmitEditing={() => {
            handleResetPassword();
            emailInputRef.current.focus();
          }}
          value={email}
          ref={emailInputRef}
          onChangeText={(text) => setEmail(text)}
        />
        {error.type === "required" ? (
          <Text style={{ color: "red" }}>{error.message}</Text>
        ) : null}
        <Button
          margin="30px 0 20px"
          title="Send Reset Password"
          onPress={handleResetPassword}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8faf9",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  signInWrapper: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    marginTop: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  inputBox: {
    borderColor: "#e5e5e5",
    borderWidth: 1,
    width: "85%",
    height: 55,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    fontSize: 20,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
