import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Input, Button, ListItem } from "react-native-elements";
import { useOvermind } from "../../store/overmind";

const TagView = () => {
  const { state, actions } = useOvermind();
  const { tagData } = state.oSaved;
  const { deleteTag } = actions.oSaved;
  const renderTag = ({ item }) => {
    return (
      <View style={styles.tagWrapper}>
        <ListItem
          style={styles.tag}
          key={item.id}
          title={item.tagName}
          bottomDivider
          chevron
        />
        <View style={styles.tagButton}>
          <Button title="Delete" onPress={() => deleteTag(item.tagId)} />
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        keyExtractor={item => item.tagId}
        data={tagData}
        renderItem={renderTag}
      />
    </View>
  );
};

let styles = StyleSheet.create({
  tagWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginRight: 10
  },
  tag: {
    flex: 4
  },
  tagButton: {
    flex: 1
  }
});

export default TagView;
