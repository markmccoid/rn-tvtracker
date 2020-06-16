import React from 'react';
import { View, Text, LayoutAnimation } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TagContainer, Tag, TagIcon, TagText } from './TagCloudStyles';

export const TagItem = ({
  tagId,
  isSelected,
  onSelectTag,
  onDeSelectTag,
  tagName,
  size = 'm',
}) => {
  return (
    <Tag
      key={tagId}
      size={size}
      onPress={() => (isSelected ? onDeSelectTag() : onSelectTag())}
      isSelected={isSelected} //used in styled components
    >
      <TagIcon>
        <AntDesign
          style={{ paddingRight: 5 }}
          name={isSelected ? 'tag' : 'tago'}
          size={size === 's' ? 15 : 20}
        />
        <TagText size={size}>{tagName}</TagText>
      </TagIcon>
    </Tag>
  );
};

const TagCloud = ({ children }) => {
  return <TagContainer>{children}</TagContainer>;
};

export default TagCloud;
