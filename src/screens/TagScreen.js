import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, Button, ListItem } from "react-native-elements";
import { useOvermind } from "../store/overmind";
import TagInput from "../components/Tags/TagInput";
import TagView from "../components/Tags/TagView";

const TagScreen = ({ navigation }) => {
  const [tagValue, setTagValue] = React.useState("");
  const { state, actions } = useOvermind();
  const { addNewTag } = actions.oSaved;
  const { tagData } = state.oSaved;

  return (
    <View>
      <Text>Tag Screen</Text>
      <TagInput />
      <TagView />
      <Button
        onPress={() => navigation.navigate("ViewMovies")}
        title="View Movies"
      />
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
export default TagScreen;
