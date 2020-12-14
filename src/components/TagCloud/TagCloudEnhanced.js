import React from "react";
import PropTypes from "prop-types";
import { View, Text, LayoutAnimation } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TagContainer, Tag, TagIcon, TagText } from "./TagCloudStyles";
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
const TagItem = ({
  tagId,
  isSelected,
  onSelectTag,
  onSelectExclude,
  onDeSelectTag,
  tagName,
  size = "m",
}) => {
  const onToggleSelect = (tagId) => {};
  return (
    <Tag
      key={tagId}
      size={size}
      onPress={() => (isSelected ? onDeSelectTag(tagId) : onSelectTag(tagId))}
      isSelected={isSelected} //used in styled components
    >
      <TagIcon>
        <AntDesign
          style={{ paddingRight: 5 }}
          name={isSelected ? "tag" : "tago"}
          size={size === "s" ? 15 : 20}
        />
        <TagText size={size}>{tagName}</TagText>
      </TagIcon>
    </Tag>
  );
};

const TagCloud = ({ children }) => {
  return <TagContainer>{children}</TagContainer>;
};

TagItem.propTypes = {
  tagId: PropTypes.string,
  isSelected: PropTypes.bool,
  onSelectTag: PropTypes.func,
  onDeSelectTag: PropTypes.func,
  tagName: PropTypes.string,
  size: PropTypes.string,
};
export default TagCloud;

/*
Usage Example:
  <TagCloud>
    {getAllMovieTags(movie.id).map((tagObj) => {
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
