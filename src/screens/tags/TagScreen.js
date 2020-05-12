import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TagInput from "../../components/Tags/TagInput";
import TagView from "../../components/Tags/TagView";

const TagScreen = () => {
  return (
    <View style={styles.wrapper}>
      <TagInput />
      <TagView />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10,
  },
  textStyle: {
    fontSize: 24,
  },
});
export default TagScreen;
