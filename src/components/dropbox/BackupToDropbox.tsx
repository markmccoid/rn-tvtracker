import React from "react";
import { View, Text, StyleSheet, TextInput, Alert, Pressable } from "react-native";
import { useOState, useOActions } from "../../store/overmind";

import { uploadDropboxFile } from "../../utils/dropboxUtils";

import PressableButton from "../common/PressableButton";
import { UserBackupObject } from "../../types";
import DropboxListFiles from "./DropboxListFiles";
import { colors } from "../../globalStyles";

const DropboxUpload = ({ token }) => {
  // const [selectedRestoreImage, setSelectedRestoreImage] = React.useState(undefined);
  const [backupFileName, setBackupFileName] = React.useState(undefined);

  const state = useOState();
  const actions = useOActions();
  const { generateBackupObject } = actions.oSaved;
  const { username } = state.oAdmin;

  React.useEffect(() => {
    setBackupFileName(`${username}-Backup.tvTracker`);
  }, []);

  //update filename checking for special chars not to be include in filename
  const updateFilename = (e: string) => {
    if (!e.match(/[^- _.A-Za-z0-9]/)) {
      setBackupFileName(e);
    }
  };
  return (
    <View>
      <Text style={styles.header}>Upload Backup File to Dropbox</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={backupFileName} onChangeText={updateFilename} />
      </View>
      <View style={{ alignItems: "center" }}>
        <PressableButton
          disabled={backupFileName?.length > 0 ? false : true}
          style={{
            backgroundColor: `${colors.dropboxBlue}${!!!backupFileName?.length ? "aa" : ""}`,
            marginBottom: 10,
          }}
          onPress={async () => {
            const backupImage = await generateBackupObject();
            const data = await uploadDropboxFile(token, "/", backupFileName, backupImage);
            if (data?.error) {
              Alert.alert("Error writing backup image", data?.error);
            } else {
              Alert.alert("Success!", `${backupFileName} written to Dropbox`);
            }
          }}
        >
          <Text style={{ color: "white" }}>Upload to Dropbox</Text>
        </PressableButton>
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
  inputContainer: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  header: {
    fontSize: 16,
    color: "white",
    backgroundColor: colors.dropboxBlue,
    padding: 5,
  },
});
export default DropboxUpload;
