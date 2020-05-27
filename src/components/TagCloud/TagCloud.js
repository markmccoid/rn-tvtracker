import React from "react";
import { View, Text, LayoutAnimation } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { TagContainer, Tag, TagIcon } from "./TagCloudStyles";

export const TagItem = ({
  tagId,
  isSelected,
  onSelectTag,
  onDeSelectTag,
  tagName,
}) => {
  return (
    <Tag
      key={tagId}
      onPress={() => (isSelected ? onDeSelectTag() : onSelectTag())}
      isSelected={isSelected} //used in styled components
    >
      <TagIcon>
        <AntDesign
          style={{ paddingRight: 5 }}
          name={isSelected ? "tag" : "tago"}
          size={20}
        />
        <Text>{tagName}</Text>
      </TagIcon>
    </Tag>
  );
};

const TagCloud = ({ children }) => {
  return <TagContainer>{children}</TagContainer>;
};

export default TagCloud;
