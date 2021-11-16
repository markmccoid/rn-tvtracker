import React from "react";
import { View, Text, StyleSheet, TextInput, Alert, Pressable } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  downloadDropboxFile,
  uploadDropboxFile,
  isDropboxTokenValid,
} from "../../utils/dropboxUtils";

import PressableButton from "../common/PressableButton";
import { UserBackupObject } from "../../types";
import DropboxListFiles from "./DropboxListFiles";
import { colors } from "../../globalStyles";
import { RefreshIcon } from "../common/Icons";

const RestoreFromDropbox = ({ token }) => {
  // const [selectedRestoreImage, setSelectedRestoreImage] = React.useState(undefined);
  const [selectedFile, setSelectedFile] = React.useState(undefined);

  const state = useOState();
  const actions = useOActions();
  const { restoreBackupObject } = actions.oSaved;

  // React.useEffect(() => {
  //   const checkToken = async () => {
  //     setIsTokenValid(await isDropboxTokenValid(token));
  //   };
  //   checkToken();
  // }, []);

  return (
    <View>
      <Text style={styles.header}>Restore Backup File from Dropbox</Text>

      <View style={{ marginVertical: 15 }}>
        <DropboxListFiles
          token={token}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
        <View style={{ alignItems: "center" }}>
          <PressableButton
            style={{
              backgroundColor: `${colors.dropboxBlue}${!!!selectedFile ? "aa" : ""}`,
              marginVertical: 10,
            }}
            onPress={async () => {
              const backupData = await downloadDropboxFile<UserBackupObject>(
                token,
                "/",
                selectedFile
              );
              const result = await restoreBackupObject(backupData);
              if (result.success) {
                Alert.alert("Restore Complete", `${selectedFile} has been restored.`);
              } else {
                Alert.alert("Restore Error", `${selectedFile} not a valid restore file.`);
              }
            }}
            disabled={!!!selectedFile}
          >
            <Text style={{ color: "white" }}>Restore Image</Text>
          </PressableButton>
        </View>
      </View>
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
  header: {
    fontSize: 16,
    color: "white",
    backgroundColor: colors.dropboxBlue,
    padding: 5,
  },
});
export default RestoreFromDropbox;