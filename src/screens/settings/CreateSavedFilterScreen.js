import React from "react";
import { Alert, View, Text, TextInput, Switch, ScrollView, StyleSheet } from "react-native";
import TagCloud, { TagItem } from "../../components/TagCloud/TagCloud";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

import FilterByTagsContainer from "../../components/Filter/FilterByTagsContainer";
import FilterByGenreContainer from "../../components/Filter/FilterByGenreContainer";
import SavedFilterSort from "./SavedFilterSort";
import { colors } from "../../globalStyles";

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
  switch (action.type) {
    case "UPDATE_TAGSTATE":
      const { tagId, tagState } = action?.payload;
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
    case "ALL_INACTIVE":
      return state.map((tagObj) => ({ ...tagObj, tagState: "inactive" }));
    default:
      return state;
  }
};

const CreateSavedFilterScreen = ({ navigation, route }) => {
  const state = useOState();
  const actions = useOActions();
  const { getInitialTagsSavedFilter, generated } = state.oSaved;
  const { addSavedFilter } = actions.oSaved;
  const { defaultSort } = state.oSaved.settings;

  //# Tag state objects
  // tagsArray = {[{tagId, tagName, tagState}, ...]}
  // initialState should be getTags sent to function to put tagState and name on all
  const [tagsState, dispatch] = React.useReducer(tagReducer, getInitialTagsSavedFilter);

  const [filterIndex, setFilterIndex] = React.useState(-1);
  const [filterName, setFilterName] = React.useState(undefined);
  const [tagOperator, setTagOperator] = React.useState("AND");
  const [excludeTagOperator, setExcludeTagOperator] = React.useState("OR");

  //# Genre state objects
  // populated intially with no selected genres. [ { genre, isSelected }]
  const [genresObj, setGenresObj] = React.useState(() =>
    generated.genres.map((genre) => ({ genre, isSelected: false }))
  );
  const [genreOperator, setGenreOperator] = React.useState("OR");

  //# Other state
  const [showInDrawer, setShowInDrawer] = React.useState(false);
  const [inEditFilter, setInEditFilter] = React.useState(false);

  const [newSort, setNewSort] = React.useState(defaultSort);
  const [sortEnabled, setSortEnabled] = React.useState(false);

  const tagFilterFunctions = {
    onAddIncludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "include" } }),
    onRemoveIncludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "inactive" } }),
    onAddExcludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "exclude" } }),
    onRemoveExcludeTag: (tagId) =>
      dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "inactive" } }),
    clearFilterTags: () => dispatch({ type: "ALL_INACTIVE" }),
    setTagOperator,
    setExcludeTagOperator,
  };

  const genreFilterFunctions = {
    addGenreToFilter: (genre) =>
      setGenresObj((prevGenreObj) =>
        prevGenreObj.map((el) => (el.genre === genre ? { genre, isSelected: true } : el))
      ),
    removeGenreFromFilter: (genre) =>
      setGenresObj((prevGenreObj) =>
        prevGenreObj.map((el) => (el.genre === genre ? { genre, isSelected: false } : el))
      ),
    clearFilterGenres: () =>
      setGenresObj((prevGenres) =>
        prevGenres.map((genreObj) => ({ ...genreObj, isSelected: false }))
      ),
    setGenreOperator,
  };

  const filterId = route?.params?.filterId;
  //# useEffect to check if Editing a filter and if so, apply fields
  React.useEffect(() => {
    // Get the filterId of the filter being edited
    if (filterId) {
      navigation.setOptions({
        title: "Edit Saved Filter",
      });

      const filterObj = state.oSaved.getSavedFilter(filterId);
      const filterGenres = filterObj?.genres || [];
      const filterSort = filterObj?.sort;

      setFilterName(filterObj.name);
      setFilterIndex(filterObj.index);
      setTagOperator(filterObj?.tagOperator);
      setExcludeTagOperator(filterObj?.excludeTagOperator || "OR");
      setGenreOperator(filterObj?.genreOperator || "OR");
      setShowInDrawer(filterObj.showInDrawer);
      setNewSort(filterSort || defaultSort);
      // When loading an existing filter, if there is no sort key on the saved filter, make sure to turn off
      // the sortEnabled flag and if there is something there, turn it on!
      setSortEnabled(!!filterSort);

      filterObj?.tags?.forEach((tagId) =>
        dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "include" } })
      );
      // update tagsState with excluded Tags in filter
      filterObj?.excludeTags?.forEach((tagId) =>
        dispatch({ type: "UPDATE_TAGSTATE", payload: { tagId, tagState: "exclude" } })
      );
      // Update the Genres from the filter
      setGenresObj((prevGenres) => {
        return prevGenres.map((el) => {
          if (filterGenres.includes(el.genre)) {
            return { ...el, isSelected: true };
          }
          return el;
        });
      });

      setInEditFilter(true);
    }
  }, []);

  const onSaveFilter = () => {
    //Take "tagsState" and create a "selectedTags" and "excludedTags" var to store
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

    const selectedGenres = genresObj
      .filter((genre) => genre.isSelected)
      .map((genre) => genre.genre);

    /**
     * id: created in action
     * name
     * tagOperator
     * tags
     * excludeTagOperator
     * excludeTags
     * genres
     * genreOperator
     * showInDrawer
     */
    //Make sure Filter name is filled in
    //AND that at least one tag OR genre has been selected
    if (
      !filterName &&
      (!selectedTags.length > 0 || !excludeTags.length > 0 || !selectedGenres.length > 0)
    ) {
      Alert.alert(
        "Problem Saving",
        "Must have a filter name at least one tag or genre selected!"
      );
      return;
    }
    const filterObj = {
      id: filterId,
      name: filterName,
      tags: includeTags,
      excludeTags,
      tagOperator,
      excludeTagOperator,
      genres: selectedGenres,
      genreOperator,
      showInDrawer,
      index: filterIndex,
      sort: sortEnabled ? newSort : undefined,
    };
    addSavedFilter(filterObj);
    navigation.goBack();
  };
  const titleSize = "m";
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.saveButton}>
        <Button
          title={inEditFilter ? "Update Filter" : "Save Filter"}
          onPress={() => onSaveFilter()}
          bgColor={colors.primary}
          color="white"
        />
      </View>
      <ScrollView style={styles.scrollViewContainer}>
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
          <Divider style={{ backgroundColor: "black", marginTop: 10 }} />
          {/* Start of Tag */}
          <View style={styles.tagContainer}>
            <FilterByTagsContainer
              titleSize={titleSize}
              title="Select Tags"
              allFilterTags={tagsState}
              operatorValues={{ tagOperator, excludeTagOperator }}
              filterFunctions={tagFilterFunctions}
            />
          </View>
          <Divider style={{ backgroundColor: "black" }} />
          <View style={{ flex: 1, flexDirection: "column", marginVertical: 10 }}>
            <FilterByGenreContainer
              titleSize={titleSize}
              title="Select Genres"
              allGenreFilters={genresObj}
              genreOperator={genreOperator}
              filterFunctions={genreFilterFunctions}
            />
          </View>
        </View>

        <View style={styles.line} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "white",
            paddingVertical: 5,
          }}
        >
          <Text>Store Custom Sort with Filter</Text>
          <Switch
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setSortEnabled}
            value={sortEnabled}
          />
        </View>
        <View style={styles.line} />
        <View style={styles.container}>
          {sortEnabled && <SavedFilterSort newSort={newSort} setNewSort={setNewSort} />}
        </View>
        <View style={{ marginTop: 5, marginBottom: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    backgroundColor: colors.background,
  },
  container: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  line: {
    height: 1,
    backgroundColor: colors.commonBorder,
  },
  title: {
    marginVertical: 10,
    fontSize: 18,
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
  saveButton: {
    marginBottom: 0,
    alignItems: "center",
    backgroundColor: colors.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 5,
  },
});

export default CreateSavedFilterScreen;
