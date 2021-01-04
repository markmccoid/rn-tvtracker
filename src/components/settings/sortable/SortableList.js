import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import SortableItem from "./SortableItem";

const SortableList = ({ children, item: { width, height }, reSort }) => {
  // const offsets = children.map((_, index) => ({
  //   // eslint-disable-next-line react-hooks/rules-of-hooks
  //   y: useSharedValue(index * height),
  //   newIndex: index,
  // }));

  // Positions are the reverse of offsets.  We use the index/position of the item to
  // determine it's offset value.
  // (index / height) * height = offset value
  // if height  = 45
  // index = 0, offset = 0
  // index = 1, offset = 45
  // index = 2, offset = 90
  // index = 3, offset = 135
  // positions = {
  // 'as54fsfd': 0
  // '4fdasdf4': 1
  //    ...

  const positions = useSharedValue(
    Object.assign({}, ...children.map((child, index) => ({ [child.props.id]: index })))
  );
  const activeIndex = useSharedValue(-1);
  return (
    <ScrollView
      contentContainerStyle={{
        height: height * children.length,
      }}
    >
      {children.map((child, index) => {
        return (
          <SortableItem
            id={child.props.id}
            key={index}
            positions={positions}
            index={index}
            width={width}
            height={height}
            activeIndex={activeIndex}
            reSort={reSort}
          >
            {child}
          </SortableItem>
        );
      })}
    </ScrollView>
  );
};

export default SortableList;
