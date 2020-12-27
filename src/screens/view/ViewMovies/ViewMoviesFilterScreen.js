import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import { useOState, useOActions } from "../../../store/overmind";
import _ from "lodash";

import { colors, styleHelpers } from "../../../globalStyles";

import { InfoIcon } from "../../../components/common/Icons";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import TagCloudEnhanced, {
  TagItemEnhanced,
} from "../../../components/TagCloud/TagCloudEnhanced";
import FilterByTagsContainer from "../../../components/Filter/FilterByTagsContainer";

const ViewMoviesFilterScreen = ({ route, navigation }) => {
  const state = useOState();
  const actions = useOActions();
  const { getAllFilterTags, getAllFilterGenres } = state.oSaved;
  // const { genres } = state.oSaved.generated;
  const { tagOperator, excludeTagOperator, genreOperator } = state.oSaved.filterData;
  const {
    addTagToFilter,
    removeTagFromFilter,
    addExcludeTagToFilter,
    removeExcludeTagFromFilter,
    clearFilterScreen,
    setTagOperator,
    setExcludeTagOperator,
    addGenreToFilter,
    removeGenreFromFilter,
    setGenreOperator,
    clearFilterTags,
    clearFilterGenres,
  } = actions.oSaved;

  //------------------------------

  //---TESTING  Probably should be a getter in the store.+
  const tagOperators = ["AND", "OR"];
  const excludeTagOperators = ["AND", "OR"];
  const genreOperators = ["AND", "OR"];

  return (
    <ScrollView bounces={false}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Button
            style={styles.buttonStyle}
            title="Clear Filters"
            type="outline"
            onPress={() => clearFilterScreen()}
          />
          <Button
            buttonStyle={[styles.buttonStyle, { backgroundColor: colors.primary }]}
            title="Done"
            onPress={() => {
              navigation.navigate("Movies", { filterModified: true });
              // navigation.goBack();
            }}
          />
        </View>
        <View>
          <FilterByTagsContainer
            allFilterTags={getAllFilterTags}
            tagOperators={tagOperators}
            excludeTagOperators={excludeTagOperators}
            operatorValues={{ tagOperator, excludeTagOperator }}
            filterFunctions={{
              onAddIncludeTag: addTagToFilter,
              onRemoveIncludeTag: removeTagFromFilter,
              onAddExcludeTag: addExcludeTagToFilter,
              onRemoveExcludeTag: removeExcludeTagFromFilter,
              setTagOperator,
              setExcludeTagOperator,
            }}
          />
        </View>

        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={styles.title}>Filter by Genre</Text>

          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                backgroundColor: "white",
                paddingLeft: 5,
              }}
            >
              <Text style={{ fontWeight: "bold", width: 60, textAlign: "center" }}>
                Include Genres
              </Text>
              <ButtonGroup
                containerStyle={{
                  width: 100,
                  borderRadius: 10,
                  height: 30,
                  borderColor: "black",
                  borderWidth: 1,
                }}
                selectedButtonStyle={{ backgroundColor: colors.includeGreen }}
                onPress={(index) => setGenreOperator(genreOperators[index])}
                buttons={genreOperators}
                selectedIndex={genreOperators.indexOf(genreOperator)}
              />
            </View>
          </View>
          <TagCloud>
            {getAllFilterGenres.map((genreObj) => {
              const { genre, isSelected } = genreObj;
              return (
                <TagItem
                  key={genre}
                  tagId={genre}
                  tagName={genre}
                  isSelected={isSelected}
                  onSelectTag={() => addGenreToFilter(genre)}
                  onDeSelectTag={() => removeGenreFromFilter(genre)}
                />
              );
            })}
          </TagCloud>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 5,
    // borderColor: "black",
    // borderWidth: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonStyle: {
    width: 150,
  },
});

export default ViewMoviesFilterScreen;
