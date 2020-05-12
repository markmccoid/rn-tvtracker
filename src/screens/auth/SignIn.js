import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm } from "react-hook-form";
import { useOvermind } from "../../store/overmind";
import Firebase from "../../storage/firebase";

import { Header, ButtonText } from "./authStyles";

const SignIn = ({ navigation, route }) => {
  let { state, actions } = useOvermind();
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    errors,
    setError,
  } = useForm();
  //} = useForm({ email: "", password: "", confirmPassword: "" });
  // create refs for use is changing input focus
  const passwordRef = React.useRef();
  const confirmPasswordRef = React.useRef();

  React.useEffect(() => {
    register({ name: "email" }, { required: true, pattern: /^\S+@\S+$/i });
    register({ name: "password" }, { required: true, maxLength: 30 });
    register({ name: "confirmPassword" }, { required: true, maxLength: 30 });
  }, [register]);
  //--Are we signing In or Creating User?
  const isSignIn = route.params?.screenFunction !== "create" ? true : false;
  console.log(isSignIn);
  //---------------------------------
  // Submit is logging into Firebase
  const onSubmit = (data, isSignInFlag) => {
    let { email, password } = data;
    console.log("OnSubmit", isSignInFlag, email, password);
    if (!email || !password) {
      Alert.alert("Must enter an email and password");
      return;
    }
    if (!isSignIn && password !== data.confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    if (isSignIn) {
      Firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          //console.log("error", error.message, error.code);
          setError("login", error.code, error.message);
          // setPassword("");
          setIsLoading(false);
        });
    } else {
      Firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((resp) => {
          return firestore.collection("users").doc(resp.user.uid).set({
            email,
          });
        })
        .then(() => setIsLoading(false))
        .catch((error) => {
          setIsLoading(false);
          reset();
          setError("login", error.code, error.message);
        });
    }
  };
  // console.log("ErrorObj", errors);

  //--- Setup second password for Create User screen
  let ConfirmPassword = !isSignIn && (
    <>
      <TextInput
        style={styles.inputBox}
        placeholder="Confirm Password"
        secureTextEntry={true}
        ref={confirmPasswordRef}
        onChangeText={(text) => setValue("confirmPassword", text, true)}
      />
      {errors.confirmPassword && <Text style={{ color: "red" }}>Required</Text>}
    </>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.wrapper}>
        <Header>MovieTracker</Header>

        <KeyboardAvoidingView behavior="height" style={styles.signInWrapper}>
          {errors.login && (
            <Text style={styles.errorText}>{errors.login.message}</Text>
          )}
          <TextInput
            style={styles.inputBox}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="next"
            onChangeText={(text) => setValue("email", text, true)}
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          {errors.email && <Text style={{ color: "red" }}>Email Required</Text>}
          <TextInput
            style={styles.inputBox}
            placeholder="Password"
            ref={passwordRef}
            secureTextEntry={true}
            returnKeyType={isSignIn ? "go" : "next"}
            onChangeText={(text) => setValue("password", text, true)}
            onSubmitEditing={
              isSignIn
                ? handleSubmit((data) => onSubmit(data, isSignIn))
                : () => confirmPasswordRef.current.focus()
            }
          />
          {errors.password && <Text style={{ color: "red" }}>Required</Text>}
          {!isSignIn ? (
            ConfirmPassword
          ) : (
            <TouchableOpacity onPress={() => navigation.push("ForgotPassword")}>
              <Text style={{ marginTop: 10, fontSize: 16, color: "#888" }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              width: "85%",
              backgroundColor: "#52aac9",
              padding: 15,
              marginVertical: 40,
              borderRadius: 5,
            }}
            onPress={handleSubmit((data) => onSubmit(data, isSignIn))}
          >
            <ButtonText>{isSignIn ? "Sign In" : "Sign Up"}</ButtonText>
          </TouchableOpacity>
          {isSignIn && (
            <View style={{ flexDirection: "row", marginTop: 50 }}>
              <Text style={{ marginRight: 5, fontSize: 16, color: "#888" }}>
                Haven't signed up yet?
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.push("CreateAccount", { screenFunction: "create" })
                }
              >
                <Text
                  style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
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
    width: "100%",
    marginTop: "45%",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  inputBox: {
    width: "85%",
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
    padding: 15,
    fontSize: 18,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    textAlign: "center",
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "red",
  },
});

export default SignIn;
