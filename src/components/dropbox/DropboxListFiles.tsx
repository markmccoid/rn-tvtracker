import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
// import { listDropboxFiles } from '../../utils/dropboxUtils'
import useDropboxFiles from "../../hooks/useDropboxFiles";
import PressableButton from "../common/PressableButton";

type Props = {
  token: string;
  selectedFile: string;
  setSelectedFile: (fileName: string) => void;
};
const DropboxListFiles = ({ token, selectedFile, setSelectedFile }: Props) => {
  const fileList = useDropboxFiles(token);
  // const [selected, setSelected] = React.useState(undefined);

  if (!fileList) {
    return (
      <View>
        <Text>Waiting...</Text>
      </View>
    );
  }
  return (
    <View>
      <Text>Files in Dropbox App Folder</Text>
      {fileList &&
        fileList.map((file) => {
          return (
            <Pressable key={file.id} onPress={() => setSelectedFile(file.fileName)}>
              <Text
                style={{
                  fontSize: 18,
                  color: "red",
                  padding: 5,
                  borderWidth: 1,
                  marginHorizontal: 15,
                  backgroundColor: selectedFile === file.fileName ? "#ccc" : "white",
                }}
              >
                {file.fileName}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export default DropboxListFiles;
