import React from "react";
import PropTypes from "prop-types";
import { AntDesign } from "@expo/vector-icons";
import { TagContainer, Tag, TagIcon, TagText } from "./TagCloudStyles";

export const TagItem = ({
  tagId,
  isSelected,
  onSelectTag,
  onDeSelectTag,
  tagName,
  size = "m",
}) => {
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
            removeTagFromTVShow({
              movieId: movie.id,
              tagId: tagObj.tagId,
            })
          }
        />
      );
    })}
  </TagCloud>
*/
