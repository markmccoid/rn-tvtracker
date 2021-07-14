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
import uuidv4 from "uuid/v4";

import { loadUsersFromStorage, saveUsersToStorage } from "../../storage/localData";

import { useOState, useOActions } from "../../store/overmind";
import { colors } from "../../globalStyles";
import { Header, ButtonText } from "./authStyles";

const SignIn = ({ navigation, route }) => {
  const state = useOState();
  const actions = useOActions();
  let { isLoggedIn } = state.oAdmin;
  let { logUserIn } = actions.oAdmin;
  const { initialTagCreation } = actions.oSaved;

  // const [isLoading, setIsLoading] = React.useState(
  //   route.params?.authStatus === 'loading' ? true : false
  // );
  const [isLoading, setIsLoading] = React.useState(false);
  const [viewState, setViewState] = React.useState("showusers"); // showusers or createuser
  const [username, setUsername] = React.useState("");
  const [allUsers, setAllUsers] = React.useState([]);
  const [error, setError] = React.useState("");

  // Load users from Async Storage
  React.useEffect(() => {
    const loadUsers = async () => {
      const loadedUsers = await loadUsersFromStorage();
      setAllUsers(loadedUsers || []);
    };
    loadUsers();
  }, []);
  //---------------------------------
  const createUser = async () => {
    if (!username || username.length === 0) {
      Alert.alert("You must enter a username");
      return;
    }

    // create new user object
    const newUser = { uid: uuidv4(), username };

    // Add new users to allUsers state
    setAllUsers([newUser, ...allUsers]);

    //! Can check for duplicate name to keep from adding that
    // Save To Async Storage in Users key
    saveUsersToStorage([newUser, ...allUsers]);
    setViewState("viewusers");
  };

  // -- LOG THE USER IN
  const onSelectUser = async (username, uid) => {
    logUserIn({ uid, username });
  };
  // const onSubmit = () => {
  //   setIsLoading(true);
  //   if (isSignIn) {
  //     Firebase.auth()
  //       .signInWithEmailAndPassword(email, password)
  //       .then((resp) => {
  //         setIsLoading(false);
  //       })
  //       .catch((error) => {
  //         setError(error.message);
  //         setIsLoading(false);
  //         Keyboard.dismiss();
  //         Alert.alert(error.message);
  //       });
  //   } else {
  //     const tagData = initialTagCreation();
  //     Firebase.auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then((resp) => {
  //         firestore.collection("users").doc(resp.user.uid).set({
  //           email,
  //           tagData,
  //         });
  //       })
  //       .catch((error) => {
  //         setIsLoading(false);
  //         setError(error.message);
  //         Keyboard.dismiss();
  //         Alert.alert(error.message);
  //       });
  //   }
  // };

  // if (isLoading || isLoggedIn === undefined) {
  //   return (
  //     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.signInWrapper}>
          <Header>TVTracker</Header>
          {viewState === "showusers" && (
            <>
              <View>
                {allUsers.map((user) => {
                  return (
                    <View>
                      <TouchableOpacity onPress={() => onSelectUser(user.username, user.uid)}>
                        <Text key={user.uid}>
                          {user.username}-{user.uid}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </>
          )}
          {viewState === "createuser" && (
            <>
              <TextInput
                style={styles.inputBox}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
                placeholder="Enter Username"
                keyboardType="default"
                returnKeyType="done"
                onChangeText={setUsername}
                onSubmitEditing={() => passwordRef.current.focus()}
              />

              <View
                style={{
                  flexDirection: "row",
                  width: "85%",
                  justifyContent: "space-between",
                  alignItems: "space-between",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity onPress={createUser}>
                  <Text style={styles.button}>Create User</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setViewState("showusers")}>
                  <Text
                    style={[
                      styles.button,
                      {
                        backgroundColor: colors.excludeRed,
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {viewState === "showusers" && (
            <TouchableOpacity
              style={{
                width: "85%",
                backgroundColor: colors.primary,
                padding: 15,
                marginVertical: 20,
                borderRadius: 5,
              }}
              onPress={() => setViewState("createuser")}
            >
              <ButtonText>Create New User</ButtonText>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#d7ebdb", //colors.backgroundColor, //"#f8faf9",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  signInWrapper: {
    width: "100%",
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
  button: {
    fontSize: 18,
    color: "white",
    backgroundColor: colors.primary,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    backgroundColor: "red",
  },
});

export default SignIn;
