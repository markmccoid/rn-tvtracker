import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { ButtonGroup } from "react-native-elements";
import { colors, styleHelpers } from "../../globalStyles";
import { InfoIcon } from "../../components/common/Icons";

import TagCloudEnhanced, { TagItemEnhanced } from "../../components/TagCloud/TagCloudEnhanced";
import FilterTagsInfoOverlay from "./FilterTagsInfoOverlay";
import { useDecodedFilter } from "../../hooks/useDecodedFilter";

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

/*
 TAG Logic Descriptions
AND/OR (=1) - Find movies that have the tag Favorite
AND (>1) - Find movies that have ALL of the tags Favorite and New and ...
OR (=1) - Find movies that have ONE of the tags Favorite Or new Or ...
AND ALSO
NOT AND/OR (=1) - Find movies the Do NOT have the tag Favorite
NOT AND (>1) - Find movies that Do NOT have ALL(Any) of the tags Favorite and New and ...
NOT OR (>1) - Find movies that Do NOT have ONE of the tags Favorite Or New Or ...
 */

const { width, height } = Dimensions.get("window");

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

  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const { finalMessage, MessageComponent } = useDecodedFilter(allFilterTags, {
    tagOperator,
    excludeTagOperator,
  });

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
        <Text style={[styles.title, { paddingRight: 10 }]}>Filter by Tags</Text>
        <TouchableOpacity onPress={() => setOverlayVisible((prev) => !prev)}>
          <InfoIcon size={25} />
        </TouchableOpacity>

        {overlayVisible && (
          <FilterTagsInfoOverlay
            filtersDecodedMessage={finalMessage}
            MessageComponent={MessageComponent}
            operatorValues={{ tagOperator, excludeTagOperator }}
            tagOperators={tagOperators}
            excludeTagOperators={excludeTagOperators}
            filterFunctions={{
              setTagOperator,
              setExcludeTagOperator,
            }}
            isVisible={overlayVisible}
            toggleVisibility={() => setOverlayVisible((prev) => !prev)}
          />
        )}
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

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonStyle: {
    width: 150,
  },
  booleanContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
  },
  switchText: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
