import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
// import { Input, Button, ListItem } from "react-native-elements";
import { Button } from "../common/Buttons";
import PressableButton from "../common/PressableButton";
import { useOActions } from "../../store/overmind";

import { colors, styleHelpers } from "../../globalStyles";

const TagInput = () => {
  const [tagValue, setTagValue] = React.useState("");
  const actions = useOActions();
  const { addNewTag } = actions.oSaved;
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
        <PressableButton
          type="primary"
          style={styles.button}
          onPress={() => {
            if (tagValue.trim().length === 0) {
              return;
            }
            addNewTag(tagValue);
            setTagValue("");
          }}
        >
          <Text style={{ color: "white" }}>Add</Text>
        </PressableButton>
        {/* <Button
          title="Add"
          bgColor={colors.primary}
          bgOpacity="ee"
          color="white"
          medium
          width="100%"
          onPress={() => {
            if (tagValue.trim().length === 0) {
              return;
            }
            addNewTag(tagValue);
            setTagValue("");
          }}
        /> */}
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
    alignItems: "center",
    justifyContent: "center",
  },
  // button: {
  //   backgroundColor: colors.buttonPrimary,
  //   // ...styleHelpers.buttonShadow,
  //   // paddingVertical: 5,
  //   // paddingHorizontal: 20,
  //   // borderRadius: 15,
  // },
});
export default TagInput;
