import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";

import { fonts } from "../../globalStyles";
import { EraserIcon, InfoIcon } from "../../components/common/Icons";

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
  titleSize = "m",
  title = "Filter by Tags",
  allFilterTags,
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
    clearFilterTags, //Optional
  } = filterFunctions;

  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const { TagMessageComponent } = useDecodedFilter({
    filterTags: allFilterTags,
    filterData: {
      tagOperator,
      excludeTagOperator,
    },
  });

  const titleIconSize = { s: 15, m: 18, l: 22 };

  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: 15,
          }}
        >
          <TouchableOpacity onPress={() => setOverlayVisible((prev) => !prev)}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Text style={[styles.title, { paddingRight: 10, fontSize: fonts[titleSize] }]}>
                {title}
              </Text>
              <InfoIcon size={titleIconSize[titleSize]} />
            </View>
          </TouchableOpacity>
          {clearFilterTags && (
            <TouchableOpacity onPress={clearFilterTags}>
              <EraserIcon size={titleIconSize[titleSize]} />
            </TouchableOpacity>
          )}
        </View>
        {overlayVisible && (
          <FilterTagsInfoOverlay
            MessageComponent={TagMessageComponent}
            operatorValues={{ tagOperator, excludeTagOperator }}
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
    fontWeight: "bold",
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

FilterByTagsContainer.propTypes = {
  titleSize: PropTypes.string,
  title: PropTypes.string,
  allFilterTags: PropTypes.arrayOf(
    PropTypes.shape({
      tagId: PropTypes.string.isRequired,
      tagName: PropTypes.string.isRequired,
      tagState: PropTypes.string.isRequired,
    })
  ),
  operatorValues: PropTypes.shape({
    tagOperator: PropTypes.oneOf(["AND", "OR"]),
    excludeTagOperator: PropTypes.oneOf(["AND", "OR"]),
  }),
  filterFunctions: PropTypes.shape({
    onAddIncludeTag: PropTypes.func.isRequired,
    onRemoveIncludeTag: PropTypes.func.isRequired,
    onAddExcludeTag: PropTypes.func.isRequired,
    onRemoveExcludeTag: PropTypes.func.isRequired,
    setTagOperator: PropTypes.func.isRequired,
    setExcludeTagOperator: PropTypes.func.isRequired,
    clearFilterTags: PropTypes.func,
  }),
};
