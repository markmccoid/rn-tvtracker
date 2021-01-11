import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
} from "react-native-reanimated";
import DragItem from "./DragItem";

import { DragHandleIcon } from "../../common/Icons";

const DragToSort = ({
  data,
  renderItem,
  index,
  itemsToShow = 2, // number of list items to show
  keyExtractor,
  handle,
  item: { width, height },
  reSort,
}) => {
  // const offsets = children.map((_, index) => ({
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
    // Object.assign({}, ...data.map((item, index) => ({ [item.id]: index })))
    Object.assign({}, ...data.map((item) => ({ [item.id]: item.index })))
  );
  const activeIndex = useSharedValue(-1);
  const scrollRef = useAnimatedRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset, layoutMeasurement }) => {
      scrollY.value = contentOffset.y;
    },
  });
  // Set up Variables
  const numberOfItems = data.length;
  const shownItems = itemsToShow > data.length ? data.length : itemsToShow;

  console.log("DATA LE", positions.value);

  const [scrollWidth, setScrollWidth] = React.useState(0);
  const Handle = () => (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ccc",
        height,
        justifyContent: "center",
      }}
    >
      <DragHandleIcon size={30} />
    </View>
  );

  return (
    <View
      style={{ height: height * shownItems }}
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setScrollWidth(width);
      }}
    >
      <Animated.ScrollView
        contentContainerStyle={{
          height: height * numberOfItems,
        }}
        ref={scrollRef}
        scrollEventThrottle={16}
        bounces={false}
        onScroll={onScroll}
      >
        {data.map((item) => {
          return (
            <DragItem
              id={item.id}
              key={item.id}
              scrollRef={scrollRef}
              scrollY={scrollY}
              contentHeight={height * numberOfItems}
              containerHeight={height * shownItems}
              positions={positions}
              index={item.index}
              width={scrollWidth}
              height={height}
              activeIndex={activeIndex}
              reSort={reSort}
              Handle={Handle}
            >
              {renderItem({ item })}
            </DragItem>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default DragToSort;
