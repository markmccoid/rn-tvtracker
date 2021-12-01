import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
// import { listDropboxFiles } from '../../utils/dropboxUtils'
import useDropboxFiles from "../../hooks/useDropboxFiles";
import PressableButton from "../common/PressableButton";
import { colors } from "../../globalStyles";
import { RefreshIcon } from "../common/Icons";

type Props = {
  token: string;
  selectedFile: string;
  setSelectedFile: (fileName: string) => void;
};
const DropboxListFiles = ({ token, selectedFile, setSelectedFile }: Props) => {
  const [refresh, setRefresh] = React.useState(false);
  const fileList = useDropboxFiles(token, refresh) || "";
  // const [selected, setSelected] = React.useState(undefined);
  const FILEITEM_HEIGHT = 35;
  const scrollHeight =
    fileList.length <= 4 ? fileList.length * FILEITEM_HEIGHT : FILEITEM_HEIGHT * 4.2;

  if (!fileList) {
    return (
      <View>
        <Text>Waiting...</Text>
      </View>
    );
  }
  return (
    <View style={{ marginHorizontal: 25 }}>
      <View
        style={{
          marginVertical: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16 }}>Select a Backup File to Restore</Text>
        <PressableButton
          onPress={() => setRefresh((prev) => !prev)}
          style={{ backgroundColor: colors.dropboxBlue }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {/* <Text style={{ color: "white", marginRight: 10 }}>Refresh</Text> */}
            <RefreshIcon size={15} color="white" />
          </View>
        </PressableButton>
      </View>
      {/* This is the error text if there is an error */}
      {fileList?.fullError && (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: colors.excludeRed,
            padding: 5,
            backgroundColor: `${colors.mutedRed}aa`,
          }}
        >
          <Text>{`Error reading App/TV_Tracker folder:`}</Text>
          <Text style={{ fontWeight: "600" }}>{`${
            fileList?.error || fileList?.fullError
          }`}</Text>
        </View>
      )}

      <ScrollView style={{ height: scrollHeight, borderWidth: 0.5 }}>
        {/* This is the list of files found in Apps/TV_Tracker */}

        {fileList.length > 0 &&
          fileList.map((file) => {
            return (
              <Pressable key={file.id} onPress={() => setSelectedFile(file.fileName)}>
                <Text
                  style={{
                    fontSize: 18,
                    height: 35,
                    color: selectedFile === file.fileName ? "white" : colors.darkText,
                    padding: 5,
                    borderWidth: 0.5,
                    backgroundColor: selectedFile === file.fileName ? "#555" : "white",
                  }}
                >
                  {file.fileName}
                </Text>
              </Pressable>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default DropboxListFiles;
