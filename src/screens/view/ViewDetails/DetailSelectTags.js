import React from "react";
import { StyleSheet, Text, View } from "react-native";

import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";

const DetailSelectTags = ({ viewTags, tags, onSelectTag, removeTagFromTVShow }) => {
  // console.log(onSelectTag({ tagId: "tag" }));
  if (!viewTags) {
    return null;
  }
  return (
    <TagCloud alignment="flex-start">
      {tags.map((tagObj) => {
        return (
          <TagItem
            key={tagObj.tagId}
            tagId={tagObj.tagId}
            tagName={tagObj.tagName}
            isSelected={tagObj.isSelected}
            onSelectTag={() => onSelectTag(tagObj)}
            onDeSelectTag={() => removeTagFromTVShow(tagObj)}
          />
        );
      })}
    </TagCloud>
  );
};

export default DetailSelectTags;

const styles = StyleSheet.create({});
