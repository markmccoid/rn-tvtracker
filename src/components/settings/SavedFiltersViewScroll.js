import React, { useState, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, FlatList } from "react-native";
import { useOState } from "../../store/overmind";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../common/Buttons";
import {
  State,
  PanGestureHandler,
  NativeViewGestureHandler,
} from "react-native-gesture-handler";

import SavedFiltersItem from "./SavedFiltersItem";
import { DragHandleIcon } from "../../components/common/Icons";

const { width, height } = Dimensions.get("window");

//-----------------------------------
function reOrder1(arr, from, to) {
  console.log(
    "before",
    arr.map((el) => el.name)
  );
  const orderedArray = arr.reduce((prev, current, idx, self) => {
    if (from === to) {
      prev.push(current);
    }
    if (idx === from) {
      return prev;
    }
    if (from < to) {
      prev.push(current);
    }
    if (idx === to) {
      prev.push(self[from]);
    }
    if (from > to) {
      prev.push(current);
    }
    return prev;
  }, []);
  console.log(
    "AFTER",
    orderedArray.map((el) => el.name)
  );
  return orderedArray;
}

function reOrder(arr, from, to) {
  let newArr = [...arr];
  // Delete the item from it's current position
  var item = newArr.splice(from, 1);

  // Move the item to its new position
  newArr.splice(to, 0, item[0]);
  return newArr;
}

const SavedFiltersView = () => {
  const state = useOState();
  const { savedFilters } = state.oSaved;
  const navigation = useNavigation();

  const [filtersData, setFiltersData] = useState(() => savedFilters);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(-1);
  const currentIndex = React.useRef(-1);
  const currentY = React.useRef(0);
  const yPos = useRef(new Animated.Value(0)).current;
  const flatListHeight = useRef(new Animated.Value(0)).current;
  const flatListTopOffset = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(new Animated.Value(0)).current;
  const rowHeight = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const listRef = useRef();
  const panRef = useRef();
  const viewRef = useRef();

  React.useEffect(() => {
    const newArray = reOrder(filtersData, 0, 1);
    console.log(newArray.map((el) => el.name));
    setFiltersData(newArray);
  }, []);
  // console.log(
  //   "NewList",
  //   filtersData.map((filter, index) => ({ name: filter.name, index }))
  // );
  //# --- Gesture Events --------
  const _onGestureEvent = (event) => {
    let { absoluteY, y, absoluteX, x, oldState, state } = event.nativeEvent;

    // console.log(`absoluteY: ${absoluteY}
    // y: ${y}
    // yPos: ${absoluteY - flatListTopOffset.current - rowHeight.current / 2}
    // flatListTopOffset: ${flatListTopOffset.current}
    // rowHeight: ${rowHeight.current}`);

    // Updates continously- index of current item in list we are over
    currentIndex.current = yToIndex(absoluteY - rowHeight.current / 2);

    // updates continously- is the value that the animated view uses to move dragged item
    yPos.setValue(absoluteY - flatListTopOffset.current - rowHeight.current / 2);
    currentY.current = absoluteY - rowHeight.current / 2;
    animateList();
  };

  const _onHandlerStateChange = (event) => {
    // console.log(State.ACTIVE, State.UNDETERMINED, State.BEGAN, State.END);
    // Event is over
    let { oldState, state } = event.nativeEvent;
    console.log("handler state", state, oldState);

    // When long gesture is actived do this
    if (state === State.ACTIVE) {
    }
    if (state === State.BEGAN) {
      // Tells us that we are in a dragging state
      setIsDragging(true);
      // Sets the Index of the item to be moved
      // Stays same throughout the move
      setDraggingIndex(yToIndex(event.nativeEvent.absoluteY - rowHeight.current / 2));
    }

    // When long gesture ends, do this
    if (state === State.END || state === State.CANCELLED) {
      setIsDragging(false);
      setDraggingIndex(-1);
    }
  };
  //# --- Gesture Events END --------

  //# --- UTILITY --------
  //Takes in the gestureStates y0 value and determines which index/item was touched.
  const yToIndex = (y) => {
    const value = Math.floor((y - flatListTopOffset.current) / rowHeight.current);
    // const value = Math.floor(
    //   (scrollOffset.current + y - flatListTopOffset.current) / rowHeight.current
    // );
    console.log(`value: ${value}
      y: ${y}
      flatListTopOffset: ${flatListTopOffset.current}
      rowHeight: ${rowHeight.current}
      `);
    if (value < 0) {
      return 0;
    }
    if (value > savedFilters.length - 1) {
      return savedFilters.length - 1;
    }
    return value;
  };

  //* Function that updates list based on where user has moved finger
  const animateList = () => {
    if (!isDragging) {
      return;
    }
    const newIdx = yToIndex(currentY.current + rowHeight.current / 2);
    if (currentIndex.current !== newIdx) {
      console.log("reordering", currentIndex.current, newIdx);
      const x = reOrder(filtersData, currentIndex.current, newIdx);
      setFiltersData(x);
      setDraggingIndex(newIdx);
      currentIndex.current = newIdx;
    }
    return;
    requestAnimationFrame(() => {
      //Check if we are near bottom
      console.log("in animatelist");
      // if (currentY.current + 60 > flatListTopOffset.current + flatListHeight.current) {
      //   flatListRef.current.scrollToOffset({
      //     offset: scrollOffset.current + 10,
      //     animated: false,
      //   });
      //   // Check if we are near the top
      // } else if (
      //   scrollOffset.current > 0 &&
      //   currentY.current - 60 <= flatListTopOffset.current
      // ) {
      //   flatListRef.current.scrollToOffset({
      //     offset: scrollOffset.current - 10,
      //     animated: false,
      //   });
      // }
      // check y value see if we need to reorder
      const newIdx = yToIndex(currentY.current + rowHeight.current / 3);
      // const newIdx = yToIndex(currentY.current);

      if (currentIndex.current !== newIdx) {
        console.log("reordering");
        setFiltersData((data) => reOrder(data, currentIndex.current, newIdx));
        setDraggingIndex(newIdx);
        currentIndex.current = newIdx;
      }
      //animateList();
    });
  };
  //# --- UTILITY END --------

  const renderList = ({ item, index }, useGestureResponder = true) => {
    return (
      <View
        key={item.id}
        onLayout={(e) => (rowHeight.current = e.nativeEvent.layout.height)}
        style={{
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          opacity: draggingIndex === index ? 0 : 1,
        }}
      >
        {useGestureResponder ? (
          <PanGestureHandler
            onGestureEvent={_onGestureEvent}
            onHandlerStateChange={_onHandlerStateChange}
            ref={panRef}
          >
            <View style={{ width: 50, borderColor: "red", borderWidth: 1 }}>
              <DragHandleIcon color="black" size={22} />
            </View>
          </PanGestureHandler>
        ) : (
          <View style={{ width: 50, borderColor: "red", borderWidth: 1 }}>
            <DragHandleIcon color="black" size={22} />
          </View>
        )}
        <SavedFiltersItem savedFilter={item} />
      </View>
    );
  };

  return (
    <View>
      <View
        style={{ position: "relative" }}
        ref={viewRef}
        onLayout={(e) => {
          viewRef.current.measure((x, y, width, height, pageX, pageY) => {
            flatListTopOffset.current = pageY;
            // console.log("VIEWRef", x, y, pageX, pageY, width, height);
          });
        }}
      >
        {isDragging && (
          <Animated.View
            style={{
              top: yPos,
              left: (width * 0.1) / 3,
              position: "absolute",
              backgroundColor: "white",
              zIndex: 2,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,
              transform: [
                {
                  scale: 1.06,
                },
              ],
            }}
          >
            {renderList({ item: filtersData[draggingIndex], index: -1 }, false)}
          </Animated.View>
        )}
        <View
          ref={listRef}
          onLayout={(e) => {
            listRef.current.measure((x, y, width, height, pageX, pageY) => {
              flatListHeight.current = pageY;
              console.log("pageY", pageY);
              // console.log("VIEWRef", x, y, pageX, pageY, width, height);
            });
          }}
        >
          {filtersData.map((savedFilter, index) => renderList({ item: savedFilter, index }))}
        </View>
        {/* <FlatList
          ref={flatListRef}
          style={styles.settingsSection}
          data={filtersData}
          keyExtractor={(item) => item.id}
          renderItem={renderList}
          scrollEnabled={!isDragging}
          scrollEventThrottle={16}
          onScroll={(e) => {
            console.log("NATIVE", e.nativeEvent.contentOffset.y);
            scrollOffset.current = e.nativeEvent.contentOffset.y;
          }}
          onLayout={(e) => {
            // flatListTopOffset.current = e.nativeEvent.layout.y;
            flatListHeight.current = e.nativeEvent.layout.height;
          }}
        /> */}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          title="Create"
          wrapperStyle={{ width: 100 }}
          onPress={() => navigation.navigate("CreateSavedFilter")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsSection: {
    marginVertical: 10,
    paddingHorizontal: 0,

    paddingVertical: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
});
export default SavedFiltersView;
