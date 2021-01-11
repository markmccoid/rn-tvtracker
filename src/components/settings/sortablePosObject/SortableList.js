import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  scrollTo,
} from "react-native-reanimated";
import SortableItem from "./SortableItem";

import { DragHandleIcon } from "../../common/Icons";
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
  const scrollRef = useAnimatedRef();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({ contentOffset, layoutMeasurement }) => {
      scrollY.value = contentOffset.y;
    },
  });

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
      style={{ height: height * 4 }}
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setScrollWidth(width);
      }}
    >
      <Animated.ScrollView
        contentContainerStyle={{
          height: height * children.length,
        }}
        ref={scrollRef}
        scrollEventThrottle={16}
        bounces={false}
        onScroll={onScroll}
      >
        {children.map((child, index) => {
          return (
            <SortableItem
              id={child.props.id}
              key={index}
              scrollRef={scrollRef}
              scrollY={scrollY}
              contentHeight={height * children.length}
              containerHeight={height * (children.length - 2)}
              positions={positions}
              index={index}
              width={scrollWidth}
              height={height}
              activeIndex={activeIndex}
              reSort={reSort}
              Handle={Handle}
            >
              {child}
            </SortableItem>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default SortableList;
