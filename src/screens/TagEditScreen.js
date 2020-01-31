import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Firebase from "../storage/firebase";

const TagEditScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Tag EditScreen</Text>
      <Text>Tag EditScreen</Text>
      <Text>Tag EditScreen</Text>
      <Text>Tag EditScreen</Text>
      <Text>Tag EditScreen</Text>
      <Button title="Log out" onPress={() => Firebase.auth().signOut()} />
    </View>
  );
};

export default TagEditScreen;
