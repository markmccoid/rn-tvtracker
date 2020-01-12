import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, Button, ListItem } from "react-native-elements";
import { useOvermind } from "../../store/overmind";

const TagInput = () => {
  const [tagValue, setTagValue] = React.useState("");
  const { state, actions } = useOvermind();
  const { addNewTag } = actions.oSaved;
  const { tagData } = state.oSaved;
  return (
    <View style={styles.tagInputWrapper}>
      <View style={styles.tagInput}>
        <Input
          maxLength={15}
          value={tagValue}
          onChangeText={value => setTagValue(value)}
          inputStyle={{ padding: 5 }}
          placeholder="Add New Tag"
          leftIcon={{ type: "font-awesome", name: "tag" }}
        />
      </View>
      <View style={styles.tagButton}>
        <Button
          title="Add"
          onPress={() => {
            addNewTag(tagValue);
            setTagValue("");
          }}
        />
      </View>
    </View>
  );
};

let styles = StyleSheet.create({
  tagInputWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginRight: 10
  },
  tagInput: {
    flex: 4
  },
  tagButton: {
    flex: 1
  }
});
export default TagInput;
