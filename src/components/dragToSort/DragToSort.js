import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
} from "react-native-reanimated";
import DragItem from "./DragItem";

import { DragHandleIcon } from "../common/Icons";
import { colors } from "../../globalStyles";

const DragToSort = ({
  data,
  renderItem,
  itemsToShow = 2, // number of list items to show
  Handle,
  itemDetail: { width, height },
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
  // make sure if itemsToShow is more than the number of items that we only show as many as we have
  const shownItems = itemsToShow > data.length ? data.length : itemsToShow;

  // Needed for effect that runs when number of data items changes
  // first time we don't want to scroll to end.
  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // When a saved filter is created or deleted, scroll to the end of the list
    const scrollValue = (numberOfItems - shownItems) * height;
    scrollRef.current.scrollTo({ x: 0, y: scrollValue, animated: true });
  }, [data.length]);

  const DefaultHandle = () => (
    <View
      style={{
        borderWidth: 1,
        borderColor: colors.listItemBorder,
        height: "100%",
        justifyContent: "center",
      }}
    >
      <DragHandleIcon size={30} />
    </View>
  );
  // Determine if Handle was passed.  If not use default
  if (typeof Handle !== "function") {
    Handle = DefaultHandle;
  }

  // Set height of scroll container
  const scrollContainerHeight = height * shownItems + 2;
  return (
    <View
      style={{
        height: scrollContainerHeight,
        backgroundColor: colors.listBackground,
        borderColor: colors.listBorder,
        borderWidth: 1,
      }}
      // onLayout={(event) => {
      //   const { x, y, width, height } = event.nativeEvent.layout;
      //   setScrollWidth(width);
      // }}
    >
      <Animated.ScrollView
        contentContainerStyle={{
          height: height * numberOfItems,
        }}
        ref={scrollRef}
        scrollEventThrottle={16}
        bounces={true}
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
