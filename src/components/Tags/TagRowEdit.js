import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Button } from "../common/Buttons";
import { useOState, useOActions } from "../../store/overmind";

const TagRowEdit = ({ currTagValue, tagId, setIsEditing }) => {
  const [tagValue, setTagValue] = React.useState(currTagValue);
  const actions = useOActions();
  const { editTag } = actions.oSaved;
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TextInput
        maxLength={15}
        value={tagValue}
        onChangeText={(value) => setTagValue(value)}
        style={{
          padding: 10,
          backgroundColor: "white",
          width: "60%",
          fontSize: 20,
          borderColor: "black",
          borderRightWidth: 1,
        }}
        placeholder="Add New Tag"
        leftIcon={{ type: "font-awesome", name: "tag" }}
      />
      <Button
        title="Save"
        onPress={() => {
          editTag({
            tagId,
            updatedTag: tagValue,
          });
          setIsEditing(undefined);
        }}
        bgColor="#d3cce3"
        small
      />
      <Button
        title="Cancel"
        small
        bgColor="#d3cce3"
        onPress={() => setIsEditing(undefined)}
      />
    </View>
  );
};

export default TagRowEdit;
