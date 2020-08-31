import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
// import { Input, Button, ListItem } from "react-native-elements";
import { Button } from "../common/Buttons";
import { useOvermind } from "../../store/overmind";

const TagInput = () => {
  const [tagValue, setTagValue] = React.useState("");
  const { state, actions } = useOvermind();
  const { addNewTag } = actions.oSaved;
  const { tagData } = state.oSaved;
  return (
    <View style={styles.tagInputWrapper}>
      <View style={styles.inputFieldWrapper}>
        <TextInput
          maxLength={15}
          value={tagValue}
          onChangeText={(value) => setTagValue(value)}
          style={styles.tagInput}
          placeholder="Add New Tag"
          leftIcon={{ type: "font-awesome", name: "tag" }}
        />
      </View>
      <View style={styles.tagButton}>
        <Button
          title="Add"
          medium
          width="100%"
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
    alignItems: "center",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  inputFieldWrapper: {
    flex: 4,
  },
  tagInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  tagButton: {
    flex: 1,
    marginLeft: 10,
  },
});
export default TagInput;
