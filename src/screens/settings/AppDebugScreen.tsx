import React from "react";
import { Alert, View, Text, TextInput, Switch, ScrollView, StyleSheet } from "react-native";
import _ from "lodash";
import { useOState, useOActions } from "../../store/overmind";
import DebugItem from "../../components/debug/DebugItem";
import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

// Use the Sharing module to let the users save the backup
// https://www.farhansayshi.com/post/how-to-save-files-to-a-device-folder-using-expo-and-react-native/#demo
const shareBackup = async (fileLocation) => {
  const UTI = "public.item";
  const shareResult = await Sharing.shareAsync(fileLocation, { UTI });
};

const getDirInfo = async () => {
  const fileInfo = await FileSystem.getInfoAsync(FileSystem.documentDirectory);
  console.log("FileInfo", fileInfo);
  const contentURI = await FileSystem.getContentUriAsync(
    `${FileSystem.documentDirectory}test.json`
  );
  console.log("Content URI", contentURI);
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
    console.log("finished writing file");
    shareBackup(`${FileSystem.documentDirectory}Mark/test.json`);
  } catch (err) {
    console.log("Error writing file", err);
  }
};

const importDataTest = async (fileName) => {
  const fileLocation = `${FileSystem.documentDirectory}${fileName}`;
  let output;
  try {
    output = await FileSystem.readAsStringAsync(fileLocation);
    output = JSON.parse(output);
    console.log(output.length);
  } catch (err) {
    console.log("error reading file", err);
  }
};
const AppDebugScreen: React.FC = (props) => {
  const state = useOState();
  const actions = useOActions();
  const tvShows = state.oSaved.savedTVShows;
  const sortedTVShows = _.sortBy(tvShows, "dateSaved");
  return (
    <View style={{ marginBottom: 100 }}>
      <PressableButton
        onPress={() => exportDataTest(tvShows)}
        style={{ backgroundColor: colors.mutedRed }}
      >
        <Text>Test Export Data</Text>
      </PressableButton>
      <PressableButton
        onPress={() => importDataTest("test.json")}
        style={{ backgroundColor: colors.imdbYellow }}
      >
        <Text>Test Import Data</Text>
      </PressableButton>
      <PressableButton
        onPress={() => makeDir("Mark")}
        style={{ backgroundColor: colors.splashGreenDark }}
      >
        <Text>Make Dir "Mark"</Text>
      </PressableButton>
      <PressableButton
        onPress={() => getDirInfo()}
        style={{ backgroundColor: colors.splashGreenLight }}
      >
        <Text>Dir Info</Text>
      </PressableButton>

      <PressableButton
        onPress={() => console.log("nothing yet")}
        style={{ backgroundColor: colors.splashGreenLight }}
      >
        <Text>Dropbox Auth</Text>
      </PressableButton>

      <Text style={{ fontSize: 18 }}>AppDebug</Text>
      <ScrollView>
        {sortedTVShows.map((show) => (
          <DebugItem key={show.id} item={show} />
        ))}
      </ScrollView>
    </View>
  );
};

export default AppDebugScreen;
