import React from "react";
import { View, Text, StyleSheet, TextInput, Alert, Pressable } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  downloadDropboxFile,
  uploadDropboxFile,
  listDropboxFiles,
} from "../../utils/dropboxUtils";

import PressableButton from "../../components/common/PressableButton";
import { UserBackupObject } from "../../types";
import DropboxListFiles from "../../components/dropbox/DropboxListFiles";

const DropboxDownload = ({ token }) => {
  // const [selectedRestoreImage, setSelectedRestoreImage] = React.useState(undefined);
  const [selectedFile, setSelectedFile] = React.useState(undefined);
  const state = useOState();
  const actions = useOActions();
  const { generateBackupObject, restoreBackupObject } = actions.oSaved;
  const { username } = state.oAdmin;
  console.log("selectedFile", selectedFile, !!selectedFile);
  return (
    <View>
      <Text style={styles.header}>Dropbox Download Testing</Text>

      <PressableButton
        style={{ backgroundColor: "purple", width: 200, marginBottom: 10 }}
        onPress={async () => {
          const backupData = await downloadDropboxFile<UserBackupObject>(
            token,
            "/",
            `Test-backup.json`
          );
          console.log("restoring");
          restoreBackupObject(backupData);
          console.log("DONE restoring");
        }}
      >
        <Text>Download from Dropbox</Text>
      </PressableButton>

      {/* <PressableButton
        onPress={async () => {
          const fileList = await listDropboxFiles(token, "");
          fileList.entries.map((entry) => {
            if (entry[".tag"] === "folder") {
              console.log("folder-", entry.path_display);
            }
            if (entry[".tag"] === "file") {
              console.log("file-", entry.path_display, entry.name);
            }
          });
        }}
      >
        <Text>List Files</Text>
      </PressableButton> */}
      <View>
        <DropboxListFiles
          token={token}
          setSelectedFile={setSelectedFile}
          selectedFile={selectedFile}
        />
        <PressableButton
          onPress={async () => {
            const backupData = await downloadDropboxFile<UserBackupObject>(
              token,
              "/",
              selectedFile
            );
            console.log("Restoring ", selectedFile);
            restoreBackupObject(backupData);
            console.log("DONE restoring");
          }}
          disabled={!!!selectedFile}
        >
          <Text>Restore Image</Text>
        </PressableButton>
      </View>

      <PressableButton
        style={{ backgroundColor: "purple", width: 200, marginBottom: 10 }}
        onPress={async () => {
          const backupImage = await generateBackupObject();
          console.log("Backupimage", backupImage.tagData);
          const data = await uploadDropboxFile(
            token,
            "/",
            `${username}-backup.json`,
            backupImage
          );
          if (data?.error) {
            Alert.prompt("Error writing backup image", data?.error);
          }
        }}
      >
        <Text>Upload to Dropbox</Text>
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
  header: {
    fontSize: 16,
    color: "white",
    backgroundColor: "#555",
    padding: 5,
  },
});
export default DropboxDownload;
