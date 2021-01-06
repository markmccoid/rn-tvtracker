import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  scrollTo,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  useSharedValue,
  withSpring,
  useDerivedValue,
  useAnimatedReaction,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const SortableItem = ({
  index,
  positions,
  scrollRef,
  scrollY,
  containerHeight,
  contentHeight,
  id,
  Handle,
  height,
  width,
  activeIndex,
  reSort,
  children,
}) => {
  const isGestureActive = useSharedValue(false);
  const translateY = useSharedValue(positions.value[id] * height);
  //https://docs.swmansion.com/react-native-reanimated/docs/next/api/useAnimatedReaction
  // The first argument (prepare) is a function and is used to do two things:
  // 1. Tells when to run the reaction (when the value passed back changes)
  // 2. returns the input to the next argumention
  // The second argument (react) is a function and accepts the returned data from arg 1
  // and performs it.
  // In this situation we want to do something to the items where the gesture is not active
  // Given that we are replacing the positions.value object each time, whenever we perform
  // a swap, all other items will be pushed through this reaction
  useAnimatedReaction(
    () => positions.value[id],
    (newIndex) => {
      if (!isGestureActive.value) {
        const pos = newIndex * height;
        translateY.value = pos;
        // translateY.value = withSpring(pos);
      }
    }
  );

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      isGestureActive.value = true;
      // Declared in parent component.  All children need to know who is active
      // Used to change opacity of active item so it covers others as passing over
      activeIndex.value = index;
      // based on the index of the item, we caclulate the starting "top" value
      // so our gesture starts moving it at the correct location
      ctx.offsetY = translateY.value; // positions.value[id] * height; //currentOffset.value;
    },

    onActive: (event, ctx) => {
      // Move the item to its new position (used in the Animated Style)
      if (event.translationY + ctx.offsetY > contentHeight - height) {
        translateY.value = contentHeight - height;
      } else {
        translateY.value =
          event.translationY + ctx.offsetY < 0 ? 0 : event.translationY + ctx.offsetY;
      }
      // offsetY is the "correct" y (top) value based on the dragging
      // However this is calculated in the useAnimatedReaction() effect.
      //const offsetY = Math.round(translateY.value / height) * height;

      // Based on current Y value, what would its index be?
      const newIndex = Math.round(translateY.value / height);
      const oldIndex = positions.value[id];

      // if the new index is different from old, then swap.
      if (oldIndex !== newIndex) {
        // Find the id that currently has the index that our moving item is now over
        // and want to have as its own.
        const idToSwap = Object.keys(positions.value).find(
          (key) => positions.value[key] === newIndex
        );
        // if an id is found, then swap.  Using JSON.parse... because Object.assign and object spread aren't working in this release
        if (idToSwap) {
          const newPositions = JSON.parse(JSON.stringify(positions.value));
          newPositions[id] = newIndex;
          newPositions[idToSwap] = oldIndex;
          positions.value = newPositions;
        }
      }
      const lowerBound = scrollY.value; // scrollY is technically the current top of the scrollview hence it is always the lower bound
      const upperBound = lowerBound + containerHeight - height;
      const maxScroll = contentHeight - containerHeight;
      const scrollLeft = maxScroll - scrollY.value;
      if (translateY.value < lowerBound) {
        const diff = Math.min(lowerBound - translateY.value, lowerBound);
        scrollY.value -= diff;
        scrollTo(scrollRef, 0, scrollY.value, false);
        ctx.offsetY -= diff;
        translateY.value = ctx.offsetY + event.translationX;
      }
      // console.log("SCROLLY", scrollY.value, contentHeight, containerHeight, height);
      // console.log("BOUNDS", upperBound, translateY.value, maxScroll, scrollLeft);
      if (translateY.value > upperBound) {
        const diff = Math.min(translateY.value - upperBound, scrollLeft);
        scrollY.value += diff;
        // console.log("MAXSCROLL: SCROLL LEFT", maxScroll, scrollLeft);
        // console.log("CONTENT: CONTAINER HEIGHT", contentHeight, containerHeight);
        // console.log(
        //   "INSIDE",
        //   scrollY.value,
        //   translateY.value,
        //   upperBound,
        //   maxScroll,
        //   scrollLeft,
        //   diff
        // );
        scrollTo(scrollRef, 0, scrollY.value, false);
        ctx.offsetY += diff;
        translateY.value = ctx.offsetY + event.translationY;
      }
    },

    onEnd: (event, ctx) => {
      isGestureActive.value = false;
      runOnJS(reSort)(positions.value);
      // Make sure to position the moving ITEM to its new home by calculating its
      // index (Math.round(yValue/height)) and then multiplying the index by the height
      // to get the y value for the top position of our ITEM.
      translateY.value = withSpring(Math.round(translateY.value / height) * height);
    },
  });

  // Depending on if item is active or not, with move it based on gesture or
  // move it to the currentOffset
  // const translateY = useDerivedValue(() => {
  //   if (isGestureActive.value) {
  //     return y.value;
  //   } else {
  //     return withSpring(currentOffset.value);
  //   }
  // });
  const style = useAnimatedStyle(() => ({
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    flex: 1,
    width,
    height,

    zIndex: activeIndex.value === index ? 100 : 1,
    transform: [
      { translateY: translateY.value },
      { scale: withSpring(isGestureActive.value ? 0.95 : 1) },
    ],
  }));
  return (
    <Animated.View style={style}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View>
          <Handle />
        </Animated.View>
      </PanGestureHandler>
      {children}
    </Animated.View>
  );
  // return (
  //   <PanGestureHandler {...{ onGestureEvent }}>
  //     <Animated.View style={style}>{children}</Animated.View>
  //   </PanGestureHandler>
  // );
};

export default SortableItem;
