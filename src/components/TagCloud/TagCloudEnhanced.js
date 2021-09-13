import React from "react";
import PropTypes from "prop-types";
import { View, Text, LayoutAnimation } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { UnTagIcon } from "../common/Icons";
import { TagContainer, TagExtended, TagIcon, TagText } from "./TagCloudStyles";
/**
 * logic to determine if we should DeSelect Tag, SelectTag or SelectExcluded tag
 * These tags can be in one of three states
 * - Not Selected
 * - Selected as a "include" tag
 * - Selected as a "exclude" tag
 *
 * Use useReducer to create a simulated state machine that will move between these states
 * The "isSelected" or maybe "selectedType" prop will inform us which state it is currently in
 * and thus what its next state will be.
 *
 * @param {*} {
 *   tagId,
 *   isSelected,
 *   onSelectTag,
 *   onSelectExclude,
 *   onDeSelectTag,
 *   tagName,
 *   size = "m",
 * }
 * @returns
 */
export const TagItemEnhanced = ({
  tagId,
  tagState,
  onAddIncludeTag,
  onRemoveIncludeTag,
  onAddExcludeTag,
  onRemoveExcludeTag,
  tagName,
  size = "m",
}) => {
  // ToggleSelect action
  // inactive --> include
  // include --> exclude
  // exclude --> inactive
  const onToggleSelect = (tagId) => {
    if (tagState === "inactive") {
      onAddIncludeTag();
    } else if (tagState === "include") {
      onRemoveIncludeTag();
      onAddExcludeTag();
    } else if (tagState === "exclude") {
      onRemoveExcludeTag();
    }
  };
  // Long press action
  // inactive --> exclude
  // include --> inactive
  // exclude --> inactive
  const onLongPress = () => {
    if (tagState === "inactive") {
      onAddExcludeTag();
    } else if (tagState === "include") {
      onRemoveIncludeTag();
    } else if (tagState === "exclude") {
      onRemoveExcludeTag();
    }
  };
  return (
    <TagExtended
      key={tagId}
      size={size}
      onPress={onToggleSelect}
      onLongPress={onLongPress}
      isSelected={tagState} //used in styled components
    >
      <TagIcon>
        {tagState === "exclude" ? (
          <UnTagIcon style={{ paddingRight: 5 }} size={size === "s" ? 15 : 20} color="white" />
        ) : (
          <AntDesign
            style={{ paddingRight: 5 }}
            name={tagState !== "inactive" ? "tag" : "tago"}
            size={size === "s" ? 15 : 20}
          />
        )}
        <TagText size={size} style={{ color: tagState === "exclude" ? "white" : "black" }}>
          {tagName}
        </TagText>
      </TagIcon>
    </TagExtended>
  );
};

const TagCloudEnhanced = ({ children, alignment = "center" }) => {
  return <TagContainer alignment={alignment}>{children}</TagContainer>;
};

TagItemEnhanced.propTypes = {
  tagId: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelectTag: PropTypes.func,
  onDeSelectTag: PropTypes.func,
  tagName: PropTypes.string,
  size: PropTypes.string,
};
export default TagCloudEnhanced;

/*
Usage Example:
  <TagCloud>
    {getAllTVShowTags(movie.id).map((tagObj) => {
      return (
        <TagItem
          key={tagObj.tagId}
          tagId={tagObj.tagId}
          tagName={tagObj.tagName}
          isSelected={tagObj.isSelected}
          onSelectTag={() =>
            addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
          }
          onDeSelectTag={() =>
            removeTagFromMovie({
              movieId: movie.id,
              tagId: tagObj.tagId,
            })
          }
        />
      );
    })}
  </TagCloud>
*/
