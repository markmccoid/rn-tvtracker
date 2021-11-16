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
  Pressable,
  ActivityIndicator,
} from "react-native";
import uuidv4 from "uuid/v4";
import DragDropEntry, { sortArray } from "@markmccoid/react-native-drag-and-order";
// import DragDropEntry, { sortArray } from "../../components/DragAndSort";

import {
  loadUsersFromStorage,
  saveUsersToStorage,
  loadCurrentUserFromStorage,
  saveCurrentUserToStorage,
  deleteLocalData,
} from "../../storage/localData";

import { useOState, useOActions } from "../../store/overmind";
import { colors } from "../../globalStyles";
import { Header, ButtonText } from "./authStyles";
import UserItem from "./UserItem";

const ITEM_HEIGHT = 35;
const SignIn = ({ navigation, route }) => {
  const state = useOState();
  const actions = useOActions();
  let { isLoggedIn } = state.oAdmin;
  let { logUserIn } = actions.oAdmin;
  const { initialTagCreation } = actions.oSaved;

  // const [isLoading, setIsLoading] = React.useState(
  //   route.params?.authStatus === 'loading' ? true : false
  // );
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewState, setViewState] = React.useState("showusers"); // showusers or createuser
  const [username, setUsername] = React.useState("");
  const [allUsers, setAllUsers] = React.useState([]);

  // Try to see all routes from sign in
  const scrollHeight = allUsers.length > 3 ? 3 * ITEM_HEIGHT : allUsers.length * ITEM_HEIGHT;
  // Load users from Async Storage
  React.useEffect(() => {
    // Need the isMounted to handle "cancellation" of async
    // if onInitialize finds a "currentUser" and runs the login function
    let isMounted = true;
    const loadUsers = async (loggedIn) => {
      if (loggedIn) return;
      setIsLoading(true);
      const loadedUsers = await loadUsersFromStorage();
      if (isMounted) {
        setAllUsers(loadedUsers || []);
        setIsLoading(false);
      }
    };
    loadUsers(isLoggedIn);
    return () => (isMounted = false);
  }, []);
  //---------------------------------
  /** updateUsers
   * sets allUsers state AND
   * saves to Storage
   */
  const updateUsers = async (users) => {
    // Add new users to allUsers state
    setAllUsers(users);
    // Save To Async Storage in Users key
    await saveUsersToStorage(users);
    setViewState("showusers");
  };
  /** createUser
   *
   */
  const createUser = async () => {
    if (!username || username.length === 0) {
      Alert.alert("You must enter a username");
      return;
    }
    if (allUsers.some((user) => user.username.toLowerCase() === username.toLowerCase())) {
      Alert.alert("Duplicate Username.  Users must have unique names.");
      setUsername("");
      return;
    }
    // create new user object
    const newUser = { uid: uuidv4(), username };

    //! Can check for duplicate name to keep from adding that
    updateUsers([newUser, ...allUsers]);
  };

  /** onSelectUser
   * Logs the user in
   * calls the oAdmin.logUserIn function that sets
   * uid overmind state var
   */
  const onSelectUser = async (username, uid) => {
    const currentUser = { uid, username };
    await saveCurrentUserToStorage(currentUser);
    logUserIn(currentUser);
  };
  /** onDeleteUser
   * blanks out currentUser and saves to Storage
   * removes user from allUsers and sets that state
   * stores new Users array to storage
   * deletes and local data associated with user that was deleted
   */
  const performDelete = async (uid) => {
    const currentUser = {};
    await saveCurrentUserToStorage(currentUser);
    // Remove user based on uid passed in
    const newUsers = allUsers.filter((user) => user.uid !== uid);
    setAllUsers(newUsers);
    await saveUsersToStorage(newUsers);
    //! Need to alert and let know that all data will be deleted
    // Delete any data assocated with uid
    await deleteLocalData(uid);
  };

  const onDeleteUser = async (uid) => {
    Alert.alert(
      "Delete User",
      "User and ALL Data for user will be deleted and cannot be recovered!",
      [
        {
          text: "OK",
          onPress: () => performDelete(uid),
          style: "default",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  if (isLoading || isLoggedIn || allUsers === undefined) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
        <View style={styles.signInWrapper}>
          <Header>TVTracker</Header>
          {viewState === "showusers" && allUsers.length > 0 && (
            <>
              <Text style={{ fontSize: 18 }}>Select a User</Text>
              <View
                style={{
                  height: scrollHeight,
                  borderWidth: 1,
                  borderColor: colors.listBorder,
                  backgroundColor: "#ddd",
                  width: "80%",
                }}
              >
                <DragDropEntry
                  // scrollStyles={{ width: 300, borderWidth: 1, borderColor: "red" }}
                  updatePositions={(positions) =>
                    updateUsers(sortArray(positions, allUsers, { idField: "uid" }))
                  }
                  itemHeight={ITEM_HEIGHT}
                  enableDragIndicator
                  dragIndicatorConfig={{ translateXDistance: 50 }}
                >
                  {allUsers.map((user) => {
                    return (
                      <Pressable
                        style={{
                          flexGrow: 1,
                          borderColor: colors.listItemBorder,
                          borderWidth: 1,
                          justifyContent: "center",
                          backgroundColor: "white",
                        }}
                        id={user.uid}
                        key={user.uid}
                        onPress={() => onSelectUser(user.username, user.uid)}
                      >
                        <UserItem
                          itemHeight={ITEM_HEIGHT}
                          user={user}
                          onSelectUser={onSelectUser}
                          onDeleteUser={onDeleteUser}
                        />
                      </Pressable>
                    );
                  })}
                </DragDropEntry>
              </View>
            </>
          )}
          {viewState === "showusers" && (
            <View style={{ flexDirection: "column", alignItems: "center", width: "100%" }}>
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
              <View style={{ width: "85%" }}>
                <Text>You may create as many users as you would like and at least one.</Text>
                <Text>All the data for each user is stored locally on your device.</Text>
              </View>
            </View>
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
                value={username}
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
    // justifyContent: "center",
    paddingTop: 100,
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
