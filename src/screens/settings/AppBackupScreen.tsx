import React from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import _, { set } from "lodash";
import { useOState, useOActions } from "../../store/overmind";
import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { isDropboxTokenValid } from "../../utils/dropboxUtils";
import DropboxAuth from "../../components/dropbox/DropboxAuth";
import BackupToDropbox from "../../components/dropbox/BackupToDropbox";
import RestoreFromDropbox from "../../components/dropbox/RestoreFromDropbox";
// Use the Sharing module to let the users save the backup
// https://www.farhansayshi.com/post/how-to-save-files-to-a-device-folder-using-expo-and-react-native/#demo
const shareBackup = async (fileLocation) => {
  const UTI = "public.item";
  const shareResult = await Sharing.shareAsync(fileLocation, { UTI });
};

const getDirInfo = async () => {
  const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
  // console.log("FileInfo", fileInfo);
  const contentURI = await FileSystem.getContentUriAsync(
    `${FileSystem.documentDirectory}test.json`
  );
  // console.log("Content URI", contentURI);
};
const makeDir = async (dirName) => {
  const fileLocation = `${FileSystem.documentDirectory}${dirName}`;
  // Get info about directory that creation has been requested on
  const fileData = await FileSystem.getInfoAsync(fileLocation);
  // if path doesn't exist OR isn't a directory, create it.
  if (!fileData.exists || !fileData.isDirectory) {
    try {
      await FileSystem.makeDirectoryAsync(fileLocation);
    } catch (err) {
      console.log("Error creating directory", err);
    }
  }
};

const exportDataTest = async (tvShows) => {
  const writeString = JSON.stringify(tvShows);
  try {
    await makeDir("Mark");
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}Mark/test.json`,
      writeString
    );
    // console.log("finished writing file");
    shareBackup(`${FileSystem.documentDirectory}Mark/test.json`);
  } catch (err) {
    // console.log("Error writing file", err);
  }
};

const importDataTest = async (fileName) => {
  const fileLocation = `${FileSystem.documentDirectory}${fileName}`;
  let output;
  try {
    output = await FileSystem.readAsStringAsync(fileLocation);
    output = JSON.parse(output);
    // console.log(output.length);
  } catch (err) {
    console.log("error reading file", err);
  }
};

const AppBackupScreen: React.FC = ({ navigation }) => {
  const [isTokenValid, setIsTokenValid] = React.useState(undefined);
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const state = useOState();
  const actions = useOActions();
  const { setDropboxToken } = actions.oAdmin;
  const { dropboxToken } = state.oAdmin;

  React.useEffect(() => {
    navigation.setOptions({
      title: "App Backup",
      headerTintColor: colors.darkText,
      headerStyle: {
        backgroundColor: colors.navHeaderColor,
      },
    });
  }, []);
  // Make sure Token we have for Dropbox is still valid
  React.useEffect(() => {
    const checkToken = async (token: string) => {
      const tokenObj = await isDropboxTokenValid(token);
      if (tokenObj?.error) {
        setErrorMessage(tokenObj.error);
      }
      setIsTokenValid(tokenObj.valid);
    };

    if (dropboxToken) {
      checkToken(dropboxToken);
    } else {
      setIsTokenValid(false);
    }
  }, [dropboxToken]);

  // Reset Token
  const resetDropboxToken = () => {
    Alert.alert(
      //This is title
      "Dropbox Token Reset",
      //This is body text
      "Remove Dropbox Token?  You will need to reauthorize dropbox if you choose Yes.",
      [
        { text: "Yes", onPress: () => setDropboxToken("") },
        { text: "Cancel", onPress: () => {}, style: "cancel" },
      ],
      { cancelable: true } //Probably want this to true
      //on clicking out side, Alert will not dismiss
    );
  };
  // Spinner while validating tokken
  if (isTokenValid === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  //
  return (
    <View style={styles.container}>
      {!isTokenValid && (
        <View style={styles.container}>
          <DropboxAuth setDropboxToken={setDropboxToken} tokenErrorMessage={errorMessage} />
        </View>
      )}

      {isTokenValid && (
        <View>
          <View style={{ alignItems: "flex-end", marginRight: 10, marginVertical: 15 }}>
            <PressableButton
              onPress={resetDropboxToken}
              style={{ backgroundColor: colors.dropboxBlue }}
            >
              <Text style={{ color: "white" }}>Remove Dropbox Auth</Text>
            </PressableButton>
          </View>

          <BackupToDropbox token={dropboxToken} />
          <RestoreFromDropbox token={dropboxToken} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
export default AppBackupScreen;
