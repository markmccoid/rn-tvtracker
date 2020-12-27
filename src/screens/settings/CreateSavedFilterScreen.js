import React from "react";
import { Alert, View, Text, TextInput, Switch, ScrollView, StyleSheet } from "react-native";
import TagCloud, { TagItem } from "../../components/TagCloud/TagCloud";
import { Button } from "../../components/common/Buttons";
import { ButtonGroup } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

import FilterByTagsContainer from "../../components/Filter/FilterByTagsContainer";
import { useDecodedFilter } from "../../hooks/useDecodedFilter";

const buildTagObjFromIds = (allTags, tagIdArray, isSelected) => {
  // loop through all tags and when find a match in passed tagIdArray
  // return an object { tagId, tagName, isSelected }
  let tagsObj = allTags.reduce((final, tagObj) => {
    if (tagIdArray.find((tagId) => tagId === tagObj.tagId)) {
      final = [...final, { tagId: tagObj.tagId, tagName: tagObj.tagName, ...isSelected }];
    }
    return final;
  }, []);
  return tagsObj;
};

const tagReducer = (state, action) => {
  // action.payload = {tagId, tagState}
  // state = [ { tagId, tagName, tagState }, ... ]
  const { tagId, tagState } = action.payload;
  switch (action.type) {
    case "UPDATE_TAGSTATE":
      // map to return new state array with tagState update with payload info.
      return state.map((tagObj) => {
        if (tagObj.tagId === tagId) {
          return {
            ...tagObj,
            tagState,
          };
        }
        return tagObj;
      });
    default:
      return state;
  }
};

const CreateSavedFilterScreen = ({ navigation, route }) => {
  const state = useOState();
  const actions = useOActions();
  const { getTags, getInitialTagsSavedFilter } = state.oSaved;
  const { addSavedFilter } = actions.oSaved;

  // tagsArray = {[{tagId, tagName, tagState}, ...]}
  // initialState should be getTags sent to function to put tagState and name on all
  const [tagsState, dispatch] = React.useReducer(tagReducer, getInitialTagsSavedFilter);

  const [selectedTags, setSelectedTags] = React.useState([]);
  const [filterName, setFilterName] = React.useState(undefined);

  const [tagOperator, setTagOperator] = React.useState("AND");
  const [excludeTagOperator, setExcludeTagOperator] = React.useState("OR");

  const [showInDrawer, setShowInDrawer] = React.useState(false);
  const [inEditFilter, setInEditFilter] = React.useState(false);

  const decodedMessageObj = useDecodedFilter(tagsState, {
    tagOperator,
    excludeTagOperator,
  });

  const tagOperators = ["AND", "OR"];
  const excludeTagOperators = ["AND", "OR"];
  const filterFunctions = {
    onAddIncludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "include" } }),
    onRemoveIncludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "inactive" } }),
    onAddExcludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "exclude" } }),
    onRemoveExcludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "inactive" } }),
    setTagOperator,
    setExcludeTagOperator,
  };

  const filterId = route?.params?.filterId;
  // useEffect to check if Editing a filter and if so, apply fields
  React.useEffect(() => {
    // Get the filterId of the filter being edited
    if (filterId) {
      const filterObj = state.oSaved.getSavedFilter(filterId);
      setFilterName(filterObj.name);
      setTagOperator(filterObj.tagOperator);
      setExcludeTagOperator(filterObj.excludeTagOperator || "OR");
      setShowInDrawer(filterObj.showInDrawer);
      // setSelectedTags(filterObj.tags);
      filterObj.tags.forEach((tagId) =>
        dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "include" } })
      );
      // update tagsState with excluded Tags in filter
      filterObj?.excludeTags?.forEach((tagId) =>
        dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "exclude" } })
      );
      setInEditFilter(true);
    }
  }, []);

  const onSaveFilter = () => {
    //Take "tagsState" and create a "selectedTags" and "excludedTags" var to store in firebase
    const includeTags = tagsState.reduce((selectedTags, tagObj) => {
      if (tagObj.tagState === "include") {
        selectedTags.push(tagObj.tagId);
      }
      return selectedTags;
    }, []);

    const excludeTags = tagsState.reduce((selectedTags, tagObj) => {
      if (tagObj.tagState === "exclude") {
        selectedTags.push(tagObj.tagId);
      }
      return selectedTags;
    }, []);

    //Make sure Filter name is filled in
    //AND that at least one tag has been selected
    /**
     * id: created in action
     * name
     * tagOperator
     * tags
     * excludeTagOperator
     * excludeTags
     * showInDrawer
     */
    if (!filterName && (!selectedTags.length > 0 || !excludeTags.length > 0)) {
      Alert.alert("Problem Saving", "Must have a filter name at least one tag selected");
      return;
    }
    const filterObj = {
      id: filterId,
      name: filterName,
      tags: includeTags,
      excludeTags,
      tagOperator,
      excludeTagOperator,
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
        {/* Start of Tag */}

        <View style={styles.tagContainer}>
          <Text style={styles.title}>Select Tags for Filter</Text>
          <FilterByTagsContainer
            allFilterTags={tagsState}
            filterDecodedMessage={decodedMessageObj.finalMessage}
            tagOperators={tagOperators}
            excludeTagOperators={excludeTagOperators}
            operatorValues={{ tagOperator, excludeTagOperator }}
            filterFunctions={filterFunctions}
          />
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
