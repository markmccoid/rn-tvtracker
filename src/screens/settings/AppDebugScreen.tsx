import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import _ from "lodash";
import { useOState, useOActions } from "../../store/overmind";
import DebugItem from "../../components/debug/DebugItem";
import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";
import Constants from "expo-constants";

import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import DropboxAuth from "../../components/dropbox/DropboxAuth";
import DropboxDownload from "../../components/dropbox/RestoreFromDropbox";
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
    console.log("Error writing file", err);
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
const AppDebugScreen: React.FC = (props) => {
  const [screen, setScreen] = React.useState("debug");
  const state = useOState();
  const actions = useOActions();
  const tvShows = state.oSaved.savedTVShows;
  const sortedTVShows = _.sortBy(tvShows, "dateSaved");
  const ButtonBar = () => (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      <PressableButton
        onPress={() => setScreen("debug")}
        style={{ backgroundColor: colors.mutedRed }}
      >
        <Text>Debug</Text>
      </PressableButton>
      {/* <PressableButton
        onPress={() => setScreen("dropbox")}
        style={{ backgroundColor: colors.splashGreenDark }}
      >
        <Text>Test Dropbox</Text>
      </PressableButton>
      <PressableButton
        onPress={() => setScreen("writedata")}
        style={{ backgroundColor: colors.mutedRed }}
      >
        <Text>Test Write Data</Text>
      </PressableButton> */}
    </View>
  );
  if (screen === "debug") {
    return (
      <View>
        {/* <Text style={{ fontSize: 24 }}>TMDBID - {Constants.manifest.extra.tmdbAPI}</Text> */}
        <ButtonBar />
        <ScrollView>
          {sortedTVShows.map((show) => (
            <DebugItem key={show.id} item={show} />
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    );
  }
  if (screen === "dropbox") {
    return (
      <View>
        <ButtonBar />
        <DropboxAuth />
        <DropboxDownload token="bOPSAHw7BucAAAAAAAAAAcvFSnlTuxJf0PovGEzFSshBTjxeByiD0_1ODUSR-u86" />
      </View>
    );
  }
  if (screen === "writedata") {
    return <ButtonBar />;
  }
};

export default AppDebugScreen;
