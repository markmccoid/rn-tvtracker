import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator
} from "react-native";

import {
  PasswordInput,
  Header,
  ClickText,
  Button,
  ButtonText
} from "./authStyles";
import Firebase, { firestore } from "../../storage/firebase";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const navigateToApp = () => {
    const promise = new Promise(resolve => {
      const subscription = navigation.addListener("didFocus", () => {
        subscription.remove();
        resolve();
      });
    });
    navigation.navigate("App");
    return promise;
  };

  const handleSignIn = () => {
    if (!password || !email) {
      setError("Must enter email and password");
      return;
    }
    setIsLoading(true);
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate("App");
        setIsLoading(false);
        // navigateToApp.then(() => {
        //   setIsLoading(false);
        // });
      })
      .catch(error => {
        setError(error.message);
        setPassword("");
        setIsLoading(false);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Header>Sign In</Header>
      </View>
      {isLoading && <ActivityIndicator size="large" />}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={email}
          onChangeText={email => setEmail(email)}
          placeholder="Email"
          autoCapitalize="none"
        />
        <PasswordInput
          error={error}
          value={password}
          onChangeText={password => {
            setError(undefined);
            setPassword(password);
          }}
          placeholder="Password"
          secureTextEntry={true}
        />
        {error && <Text>{error}</Text>}
        <Button disabled={isLoading} onPress={handleSignIn}>
          <ButtonText>Sign In</ButtonText>
        </Button>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.signUpButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <ClickText>Forgot Password?</ClickText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignUp")}
          >
            <ClickText>Sign Up</ClickText>
          </TouchableOpacity>
        </View>
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
  },
  signUpButton: {
    marginHorizontal: 30,
    padding: 10
  }
});

export default SignInScreen;
