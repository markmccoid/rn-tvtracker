import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useDerivedValue,
} from "react-native-reanimated";

const SortableItem = ({ index, offsets, width, height, activeIndex, children }) => {
  // calculate this items offset y value based on index
  const isGestureActive = useSharedValue(false);
  const currentOffset = useSharedValue(offsets[index].y);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      isGestureActive.value = true;
      activeIndex.value = index;
      ctx.offsetY = currentOffset.value;
    },
    onActive: (event, ctx) => {
      x.value = event.translationX;
      y.value = event.translationY + ctx.offsetY;
      // offsetY is the "correct" y (top) value of the item being dragged
      const offsetY = Math.round(y.value / height) * height;
      // Math.round(y.value / height) will equal the "NEW" index based on the y.value (movement)

      offsets.forEach((offset, i) => {
        console.log("check if updating offset", offset.y, offsetY, i);
        if (offset.y === offsetY && index !== i) {
          // currentOffset is the y value for the current index
          // We are movieing it into the offsets array of initial offset values for each index
          offset.y = currentOffset.value;
          console.log("AFTER updating offset", offset.y);
          // offsetY will not be our NEW index for the currently active card
          currentOffset.value = offsetY;
        }
      });
    },
    onEnd: (event, ctx) => {
      isGestureActive.value = false;
      x.value = withSpring(0);
      // when user lets go, spring to to currentOffset y value for index/card
      y.value = withSpring(currentOffset.value);
      console.log("offesets", offsets);
    },
  });

  // Depending on if item is active or not, with move it based on gesture or
  // move it to the currentOffset
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return y.value;
    } else {
      return withSpring(currentOffset.value);
    }
  });
  const style = useAnimatedStyle(() => ({
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    zIndex: activeIndex.value === index ? 100 : 1,
    transform: [
      { translateY: translateY.value },
      { scale: withSpring(isGestureActive.value ? 1.05 : 1) },
    ],
  }));
  return (
    <PanGestureHandler {...{ onGestureEvent }}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

export default SortableItem;
