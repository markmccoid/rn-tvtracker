import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ButtonGroup } from "react-native-elements";
import { colors, styleHelpers } from "../../globalStyles";

import TagCloudEnhanced, { TagItemEnhanced } from "../../components/TagCloud/TagCloudEnhanced";

/** props
 *   allFilterTags - array of filter tags in format of { tagId, tagName, tagState }
 *   tagOperators - array of tagOperators, ['AND', 'OR']
 *   excludeTagOperators - array of ExcludeTagOperators, ['AND', 'OR']
 *   operatorValues - current value of operators - { tagOperator, excludeTagOperator }
 *   filterFunctions - functions needed by TagCloud -
 *   { onAddIncludeTag:
 *     onRemoveIncludeTag: removeTagFromFilter,
 *     onAddExcludeTag: addExcludeTagToFilter,
 *     onRemoveExcludeTag: removeExcludeTagFromFilter,
 *     setTagOperator,
 *     setExcludeTagOperator,
 *    }
 *
 */

const FilterByTagsContainer = ({
  allFilterTags,
  tagOperators,
  excludeTagOperators,
  operatorValues,
  filterFunctions,
}) => {
  const { tagOperator, excludeTagOperator } = operatorValues;
  const {
    onAddIncludeTag,
    onRemoveIncludeTag,
    onAddExcludeTag,
    onRemoveExcludeTag,
    setTagOperator,
    setExcludeTagOperator,
  } = filterFunctions;

  return (
    <View>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            backgroundColor: "white",
            paddingLeft: 5,
            margin: 5,
          }}
        >
          <Text style={{ fontWeight: "bold", width: 60, textAlign: "center" }}>
            Include Tags
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
            onPress={(index) => setTagOperator(tagOperators[index])}
            buttons={tagOperators}
            selectedIndex={tagOperators.indexOf(tagOperator)}
          />
        </View>
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
            Exclude Tags
          </Text>
          <ButtonGroup
            containerStyle={{
              width: 100,
              borderRadius: 10,
              height: 30,
              borderColor: "black",
              borderWidth: 1,
            }}
            selectedButtonStyle={{ backgroundColor: colors.excludeRed }}
            onPress={(index) => setExcludeTagOperator(excludeTagOperators[index])}
            buttons={excludeTagOperators}
            selectedIndex={excludeTagOperators.indexOf(excludeTagOperator)}
          />
        </View>
      </View>
      <TagCloudEnhanced>
        {allFilterTags.map((tagObj) => {
          return (
            <TagItemEnhanced
              key={tagObj.tagId}
              tagId={tagObj.tagId}
              tagName={tagObj.tagName}
              tagState={tagObj.tagState}
              onAddIncludeTag={() => onAddIncludeTag(tagObj.tagId)}
              onRemoveIncludeTag={() => onRemoveIncludeTag(tagObj.tagId)}
              onAddExcludeTag={() => onAddExcludeTag(tagObj.tagId)}
              onRemoveExcludeTag={() => onRemoveExcludeTag(tagObj.tagId)}
            />
          );
        })}
      </TagCloudEnhanced>
    </View>
  );
};

export default FilterByTagsContainer;

const styles = StyleSheet.create({});
