import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TagInput from "../../components/Tags/TagInput";
import TagViewPan from "../../components/Tags/TagViewPan";
import { colors } from "../../globalStyles";

const TagScreen = () => {
  return (
    <View style={styles.wrapper}>
      <TagInput />
      <TagViewPan />
      {/* <TagView /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: colors.background,
  },
  textStyle: {
    fontSize: 24,
  },
});
export default TagScreen;
