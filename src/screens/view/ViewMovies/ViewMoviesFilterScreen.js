import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import { useOvermind } from "../../../store/overmind";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import _ from "lodash";

const ViewMoviesFilterScreen = ({ navigation }) => {
  const { state, actions } = useOvermind();
  const { getAllFilterTags } = state.oSaved;
  const { tagOperator } = state.oSaved.filterData;
  const {
    addTagToFilter,
    removeTagFromFilter,
    clearFilterTags,
    setTagOperator,
  } = actions.oSaved;
  //---TESTING  Probably should be a getter in the store.+
  const tagOperators = ["AND", "OR"];
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Filter by Tags</Text>
        <ButtonGroup
          onPress={(index) => setTagOperator(tagOperators[index])}
          buttons={tagOperators}
          selectedIndex={tagOperators.indexOf(tagOperator)}
        />
        <TagCloud>
          {getAllFilterTags.map((tagObj) => {
            return (
              <TagItem
                key={tagObj.tagId}
                tagId={tagObj.tagId}
                tagName={tagObj.tagName}
                isSelected={tagObj.isSelected}
                onSelectTag={() => addTagToFilter(tagObj.tagId)}
                onDeSelectTag={() => removeTagFromFilter(tagObj.tagId)}
              />
            );
          })}
        </TagCloud>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button
          style={styles.buttonStyle}
          title="Clear Filters"
          type="outline"
          onPress={() => clearFilterTags()}
        />
        <Button
          style={styles.buttonStyle}
          title="Done"
          onPress={() => {
            navigation.navigate("Movies", { returning: true });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonStyle: {
    width: 150,
  },
});

export default ViewMoviesFilterScreen;
