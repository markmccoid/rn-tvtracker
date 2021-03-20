import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { useOState } from "../../store/overmind";
import TagInput from "../../components/Tags/TagInput";
import TagViewPan from "../../components/Tags/TagViewPan";
import { colors } from "../../globalStyles";

const TagScreen = () => {
  //Get tag data from Overmind
  const state = useOState();
  const { getTaggedCount } = state.oSaved;
  return (
    <View style={styles.wrapper}>
      <TagInput />
      <TagViewPan taggedCount={getTaggedCount} />
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
