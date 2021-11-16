import * as React from "react";
import { StyleSheet, ViewStyle, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";

import DefaultHandle from "./Handle";
import MoveableItem from "./MoveableItem";
import { Positions } from "./helperFunctions";

import defaultDragIndicator, {
  DragIndicatorProps,
  DragIndicatorConfig,
} from "./DefaultDragIndicator";

export type TScrollFunctions = {
  scrollToEnd: () => void;
  scrollToStart: () => void;
  scrollToY: () => void;
};

interface Props {
  updatePositions: (positions: Positions) => void;
  itemHeight: number;
  handle?: React.FC;
  handlePosition?: "left" | "right";
  enableHapticFeedback?: boolean;
  dragIndicator?: React.FC<DragIndicatorProps>;
  dragIndicatorConfig?: DragIndicatorConfig | undefined;
  enableDragIndicator?: boolean;
  scrollStyles?: ViewStyle;
  getScrollFunctions?: (funtionObj: TScrollFunctions) => void;
  children:
    | React.ReactElement<{ id: number | string }>[]
    | React.ReactElement<{ id: number | string }>;
}
//!! Context Test
// export const PositionsObjContext = React.createContext();
import PositionsProvider from "./DragSortContext";

const DragDropEntryChildren = ({
  updatePositions,
  itemHeight,
  handle = DefaultHandle,
  handlePosition = "left",
  scrollStyles,
  getScrollFunctions,
  enableHapticFeedback = true,
  enableDragIndicator = false,
  dragIndicator = defaultDragIndicator,
  dragIndicatorConfig = { translateXDistance: 10 },
  children,
}: Props) => {
  //*Scrollview animated ref
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  // const positions = useSharedValue<Positions>({});
  //
  const positions = useSharedValue<Positions>(
    Object.assign(
      {},
      ...React.Children.map(children, (child, idx) => ({
        [`${child.props.id}`]: idx,
      }))
    )
  );

  const scrollY = useSharedValue(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const numberOfItems = React.useMemo(() => React.Children.count(children), [children]);
  positions.value = Object.assign(
    {},
    ...React.Children.map(children, (child, idx) => ({
      [`${child.props.id}`]: idx,
    }))
  );

  const prevNumberOfItems = React.useRef(numberOfItems);

  // Assign scroll functions
  React.useEffect(() => {
    if (scrollViewRef.current && getScrollFunctions) {
      const scrollFuncs = {
        scrollToEnd: (): void => scrollViewRef.current?.scrollToEnd(),
        scrollToStart: (): void => scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
        scrollToY: (yPos: number): void =>
          scrollViewRef.current?.scrollTo({ y: yPos, animated: true }),
      };
      getScrollFunctions(scrollFuncs);
    }
  }, []);

  //! When scrollview gets children added or removed got to end or start of list
  //! Probably best to use this example in the component calling DragDropEntry
  // React.useEffect(() => {
  //   // Item has been added (more items than before)
  //   if (numberOfItems > prevNumberOfItems.current && scrollViewRef.current) {
  //     console.log("Scrolling To End >");
  //     scrollViewRef.current.scrollToEnd();
  //   } else if (numberOfItems < prevNumberOfItems.current && scrollViewRef.current) {
  //     //Item has been removed
  //     // If you want to scroll to end on delete must check top bound
  //     const topBound = numberOfItems * itemHeight - containerHeight;
  //     console.log("SY", scrollY.value, topBound);
  //     scrollViewRef.current.scrollTo({ y: 0, animated: true });
  //     if (scrollY.value > topBound) {
  //       console.log("Scrolling To End <");
  //     }
  //   }
  //   prevNumberOfItems.current = numberOfItems;
  // }, [numberOfItems]);

  // Wrap each child item in the MoveableItem component.

  // Could issue be because the function passed to map stores positions.value in a closure????
  const moveableItems = React.Children.map(children, (child) => {
    const id = child.props.id;
    return (
      <MoveableItem
        id={id}
        key={id}
        scrollY={scrollY}
        scrollViewRef={scrollViewRef}
        numberOfItems={numberOfItems}
        itemHeight={itemHeight}
        containerHeight={containerHeight}
        updatePositions={updatePositions}
        handle={handle}
        handlePosition={handlePosition}
        enableHapticFeedback={enableHapticFeedback}
        enableDragIndicator={enableDragIndicator}
        dragIndicator={dragIndicator}
        dragIndicatorConfig={dragIndicatorConfig}
      >
        {child}
      </MoveableItem>
    );
  });

  return (
    <PositionsProvider positions={positions}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={scrollStyles}
        onLayout={(e) => {
          setContainerHeight(e.nativeEvent.layout.height);
        }}
        contentContainerStyle={{
          height: numberOfItems * itemHeight,
        }}
      >
        {moveableItems}
      </Animated.ScrollView>
    </PositionsProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: 100,
    padding: 10,
    borderWidth: 1,
  },
});

export default DragDropEntryChildren;
