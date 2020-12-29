import React from "react";
import { Alert, View, Text, TextInput, Switch, ScrollView, StyleSheet } from "react-native";
import TagCloud, { TagItem } from "../../components/TagCloud/TagCloud";
import { Button } from "../../components/common/Buttons";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../store/overmind";

import FilterByTagsContainer from "../../components/Filter/FilterByTagsContainer";
import FilterByGenreContainer from "../../components/Filter/FilterByGenreContainer";

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

const titleFontSize = { s: "sizeSmall", m: "sizeMedium", l: "sizeLarge" };
const titleIconSize = { s: 15, m: 18, l: 22 };

const CreateSavedFilterScreen = ({ navigation, route }) => {
  const state = useOState();
  const actions = useOActions();
  const { getTags, getInitialTagsSavedFilter, generated } = state.oSaved;
  const { addSavedFilter } = actions.oSaved;

  //# Tag state objects
  // tagsArray = {[{tagId, tagName, tagState}, ...]}
  // initialState should be getTags sent to function to put tagState and name on all
  const [tagsState, dispatch] = React.useReducer(tagReducer, getInitialTagsSavedFilter);

  // const [selectedTags, setSelectedTags] = React.useState([]);
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
      const filterObj = state.oSaved.getSavedFilter(filterId);
      const filterGenres = filterObj?.genres || [];

      setFilterName(filterObj.name);
      setTagOperator(filterObj?.tagOperator);
      setExcludeTagOperator(filterObj?.excludeTagOperator || "OR");
      setGenreOperator(filterObj?.genreOperator || "OR");
      setShowInDrawer(filterObj.showInDrawer);
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
    };
    addSavedFilter(filterObj);
    navigation.goBack();
  };
  const titleSize = "m";
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
        <View style={styles.saveButton}>
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
    marginBottom: 50,
  },
});

export default CreateSavedFilterScreen;
