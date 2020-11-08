import React from "react";
import { StyleSheet, View, TextInput, Text, Dimensions } from "react-native";
import { Overlay } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";
import { Button } from "../common/Buttons";
import { colors } from "../../globalStyles";

const { width, height } = Dimensions.get("window");

const TagRowEditOverlay = ({ isVisible, currTagValue, tagId, setIsEditing }) => {
  const [tagValue, setTagValue] = React.useState(currTagValue);
  const actions = useOActions();
  const { editTag } = actions.oSaved;

  return (
    <Overlay isVisible={isVisible} overlayStyle={styles.overlay}>
      <View style={styles.subView}>
        <TextInput
          maxLength={15}
          value={tagValue}
          onChangeText={(value) => setTagValue(value)}
          style={styles.textInput}
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
            width={90}
            medium
          />
          <Button
            title="Cancel"
            medium
            bgColor="white"
            width={90}
            color={colors.primary}
            onPress={() => setIsEditing(undefined)}
          />
        </View>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.background,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    width: width / 1.5,
    height: width / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ccc",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.53,
    shadowRadius: 2.62,

    elevation: 4,
  },
  subView: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: "column",
    width: "100%",
  },
  textInput: {
    padding: 10,
    backgroundColor: "white",
    //width: "60%",
    fontSize: 20,
    borderColor: "black",
    borderWidth: 1,
  },
});
export default TagRowEditOverlay;
