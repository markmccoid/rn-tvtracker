import React from "react";
import { Alert, View, Text, TextInput, Switch, ScrollView, StyleSheet } from "react-native";
import TagCloud, { TagItem } from "../../components/TagCloud/TagCloud";
import { Button } from "../../components/common/Buttons";
import { ButtonGroup } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

const CreateSavedFilterScreen = ({ navigation, route }) => {
  const [selectedTags, setSelectedTags] = React.useState([]);
  const [filterName, setFilterName] = React.useState(undefined);
  const [tagOperator, setTagOperator] = React.useState("AND");
  const [showInDrawer, setShowInDrawer] = React.useState(false);
  const [inEditFilter, setInEditFilter] = React.useState(false);

  const tagOperators = ["AND", "OR"];

  const state = useOState();
  const actions = useOActions();
  const { getTags } = state.oSaved;
  const { addSavedFilter } = actions.oSaved;

  const filterId = route?.params?.filterId;
  React.useEffect(() => {
    // Get the filterId of the filter being edited
    if (filterId) {
      const filterObj = state.oSaved.getSavedFilter(filterId);
      setFilterName(filterObj.name);
      setTagOperator(filterObj.tagOperator);
      setShowInDrawer(filterObj.showInDrawer);
      setSelectedTags(filterObj.tags);
      setInEditFilter(true);
    }
  }, []);

  const onSaveFilter = () => {
    //Make sure Filter name is filled in
    //AND that at least one tag has been selected
    /**
     * id: created in action
     * name:
     * tagOperator
     * tags
     * showInDrawer
     */
    if (!filterName && !selectedTags.length) {
      Alert.alert("Problem Saving", "Must have a filter name at least one tag selected");
      return;
    }
    const filterObj = {
      id: filterId,
      name: filterName,
      tags: selectedTags,
      tagOperator,
      showInDrawer,
    };
    addSavedFilter(filterObj);
    navigation.goBack();
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Filter Name:</Text>
        <View>
          <TextInput
            placeholder="Enter Filter Name"
            onChangeText={(e) => setFilterName(e)}
            value={filterName}
            autoCorrect={true}
            autoCapitalize="sentences"
            clearButtonMode="while-editing"
            style={styles.filterName}
          />
        </View>
        <View>
          <Text style={styles.title}>Show On Menu?</Text>
          <Switch onValueChange={(val) => setShowInDrawer(val)} value={showInDrawer} />
        </View>
        <View>
          <Text style={styles.title}>Select Tag Operator</Text>
          <ButtonGroup
            onPress={(index) => setTagOperator(tagOperators[index])}
            buttons={tagOperators}
            selectedIndex={tagOperators.indexOf(tagOperator)}
          />
        </View>
        <View style={styles.tagContainer}>
          <Text style={styles.title}>Select Tags for Filter</Text>
          <TagCloud>
            {getTags.map((tagObj) => {
              return (
                <TagItem
                  key={tagObj.tagId}
                  tagId={tagObj.tagId}
                  tagName={tagObj.tagName}
                  isSelected={selectedTags.includes(tagObj.tagId)}
                  onSelectTag={() =>
                    setSelectedTags((currTags) => [...currTags, tagObj.tagId])
                  }
                  onDeSelectTag={() =>
                    setSelectedTags((currTags) =>
                      currTags.filter((tag) => tag !== tagObj.tagId)
                    )
                  }
                />
              );
            })}
          </TagCloud>
        </View>
        <View>
          <Button
            title={inEditFilter ? "Update Filter" : "Save Filter"}
            onPress={() => onSaveFilter()}
            bgColor="#aeaeae"
            bgOpacity="aa"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  title: {
    marginVertical: 10,
    fontSize: 15,
    fontWeight: "bold",
  },
  filterName: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  tagContainer: {
    marginVertical: 10,
  },
});

export default CreateSavedFilterScreen;
