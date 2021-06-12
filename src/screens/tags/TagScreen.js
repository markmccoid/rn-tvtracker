import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useOState } from "../../store/overmind";
import TagInput from "../../components/Tags/TagInput";
import TagViewPan from "../../components/Tags/TagViewPan";
import TagsView from "../../components/Tags/TagsView";
import { colors } from "../../globalStyles";

import { withTheme } from "react-native-elements";

const TagScreen = () => {
  //Get tag data from Overmind
  const state = useOState();
  const { tagData, getTaggedCount } = state.oSaved;

  return (
    <View style={styles.wrapper}>
      <TagInput />
      {/* <TagViewPan taggedCount={getTaggedCount} /> */}
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
