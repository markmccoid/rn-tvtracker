import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useOState } from "../../store/overmind";
import TagInput from "../../components/Tags/TagInput";
import TagsView from "../../components/Tags/TagsView";
import { colors } from "../../globalStyles";
import { TagsScreenProps } from "./tagTypes";

const TagScreen = ({ navigation, route }: TagsScreenProps) => {
  //Get tag data from Overmind
  const state = useOState();

  return (
    <View style={styles.wrapper}>
      <TagInput />
      <View style={{ flex: 1 }}>
        <TagsView />
      </View>
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
