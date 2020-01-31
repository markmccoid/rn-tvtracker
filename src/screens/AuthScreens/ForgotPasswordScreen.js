import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  View
} from "react-native";

import {
  PasswordInput,
  Header,
  IntroText,
  Button,
  ButtonText
} from "./authStyles";
import Firebase, { firestore } from "../../storage/firebase";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState();
  const [resetComplete, setResetComplete] = useState(false);
  // Firebase will send user an email with reset instructions
  const sendResetCode = () => {
    setError(null);
    Firebase.auth()
      .sendPasswordResetEmail(email)
      .then(resp => {
        setResetComplete(true);
      })
      .catch(error => {
        console.log(typeof error);
        console.log(error.code);
        setError(error.code);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Header>Forgot Password</Header>
        {resetComplete ? (
          <View>
            <IntroText>
              Check your email and follow the instructions to reset your email.
              Then you can sign in with your new password.
            </IntroText>
            <TouchableOpacity
              style={{ alignItems: "center", marginVertical: 29 }}
              onPress={() => navigation.navigate("SignIn")}
            >
              <Text style={{ fontSize: 30 }}>Sign In</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <IntroText>
            Enter Your Email and we will send you a code that you can use to
            reset your password.
          </IntroText>
        )}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={email => setEmail(email)}
          placeholder="Email"
          autoCapitalize="none"
        />
        {error && <Text>{error}</Text>}
        <Button onPress={sendResetCode}>
          <ButtonText>Send Reset Code</ButtonText>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  inputContainer: {
    flex: 2,
    width: "100%",
    alignItems: "center"
  },
  inputBox: {
    width: "85%",
    margin: 10,
    padding: 15,
    fontSize: 16,
    borderColor: "#d3d3d3",
    borderBottomWidth: 1,
    textAlign: "center"
  }
});

export default ForgotPasswordScreen;
