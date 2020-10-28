import React from "react";
import { KeyboardAvoidingView, View, TextInput, Text, TouchableOpacity } from "react-native";
import { Overlay } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { Button } from "../common/Buttons";
import { colors } from "../../globalStyles";

const TagRowEditOverlay = ({ isVisible, currTagValue, tagId, setIsEditing }) => {
  const [tagValue, setTagValue] = React.useState(currTagValue);
  const actions = useOActions();
  const { editTag } = actions.oSaved;
  const { width, height } = useDimensions().window;

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={{
        backgroundColor: colors.background,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 15,
      }}
    >
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 10,
          flexDirection: "column",
          width: width / 2,
          height: height / 6,
        }}
      >
        <TextInput
          maxLength={15}
          value={tagValue}
          onChangeText={(value) => setTagValue(value)}
          style={{
            padding: 10,
            backgroundColor: "white",
            //width: "60%",
            fontSize: 20,
            borderColor: "black",
            borderWidth: 1,
          }}
          placeholder="Add New Tag"
          leftIcon={{ type: "font-awesome", name: "tag" }}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
          <Button
            title="Save"
            onPress={() => {
              editTag({
                tagId,
                updatedTag: tagValue,
              });
              setIsEditing(undefined);
            }}
            bgColor={colors.primary}
            color="white"
            width={80}
            medium
          />
          <Button
            title="Cancel"
            medium
            bgColor="white"
            width={80}
            color={colors.primary}
            onPress={() => setIsEditing(undefined)}
          />
        </View>
      </View>
    </Overlay>
  );
};

export default TagRowEditOverlay;
