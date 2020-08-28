import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import { useDimensions } from "@react-native-community/hooks";
import { useOvermind } from "../../store/overmind";
import { DragHandleIcon } from "../common/Icons";
import TagRowEdit from "./TagRowEdit";
//TODO -- Overmind save bounce the save
//---------------------------------
//-----------------------------------
function reOrder(arr, from, to) {
  return arr.reduce((prev, current, idx, self) => {
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
}

const TagViewPan = () => {
  const [isEditing, setIsEditing] = React.useState(undefined);
  const [dragging, setDragging] = React.useState(false);
  const [draggingIdx, setDraggingIdx] = React.useState(-1);
  // Refs for values that I want to hold through rerenders
  const pointY = React.useRef(new Animated.Value(0)).current;
  const currentY = React.useRef(0);
  const flatListTopOffset = React.useRef(0);
  const viewRef = React.useRef();
  const scrollOffset = React.useRef(0);
  const rowHeight = React.useRef(0);
  const currentIdx = React.useRef(-1);
  const active = React.useRef(false);
  const flatListHeight = React.useRef(0);
  let flatListRef = React.useRef();
  let listViewRef = React.useRef();
  const { width, height } = useDimensions().window;
  //Get tag data from Overmind
  const { state, actions } = useOvermind();
  // tagData = [ { tagId, tagName }, ...]
  const [data, setData] = React.useState();
  const { tagData } = state.oSaved;
  const { updateTags, deleteTag } = actions.oSaved;

  // const [data, setData] = React.useState(tagData);
  React.useEffect(() => {
    setData([...tagData]);
  }, [tagData.length]);

  const _panResponder = PanResponder.create({
    // Ask to be the responder:
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

    onPanResponderGrant: (evt, gestureState) => {
      // The gesture has started. Show visual feedback so the user knows
      // what is happening!
      // gestureState.d{x,y} will be set to zero now

      // currentY.current = evt.nativeEvent.locationY;
      // currentIdx.current = yToIndex(evt.nativeEvent.locationY);
      currentY.current = gestureState.y0;
      currentIdx.current = yToIndex(gestureState.y0);
      active.current = true;

      pointY.setValue(
        gestureState.y0 - flatListTopOffset.current - rowHeight.current / 2
      );
      // console.log("START============================================");
      // console.log("GS-moveY, y0", gestureState.moveY, gestureState.y0);
      // console.log(
      //   "pointY",
      //   gestureState.y0 - flatListTopOffset.current - rowHeight.current / 2
      // );
      // console.log("currentIdx", currentIdx.current);
      // console.log("scrollOffset", scrollOffset.current);
      setDraggingIdx(currentIdx.current);
      setDragging(true);
    },
    onPanResponderMove: (evt, gestureState) => {
      // console.log("Moving", gestureState.moveY);
      // console.log("currentidx, dragidx", currentIdx.current, draggingIdx);
      // console.log("MOVE============================================");
      // console.log("GS-moveY, vy", gestureState.moveY, gestureState.vy);
      // console.log("CurrentIndex", currentIdx.current);
      currentY.current = gestureState.moveY - rowHeight.current / 2;
      pointY.setValue(
        gestureState.moveY - flatListTopOffset.current - rowHeight.current / 2
      );
      animateList();
    },
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      reset();
      updateTags(data);
    },
    onPanResponderTerminate: (evt, gestureState) => {
      // Another component has become the responder, so this gesture
      // should be cancelled
      reset();
    },
    onShouldBlockNativeResponder: (evt, gestureState) => {
      // Returns whether this component should block native components from becoming the JS
      // responder. Returns true by default. Is currently only supported on android.
      return true;
    },
  });
  const reset = () => {
    active.current = false;
    setDragging(false);
    setDraggingIdx(-1);
  };

  //Function that updates list based on where user has moved finger
  const animateList = () => {
    if (!active.current) {
      return;
    }
    requestAnimationFrame(() => {
      //Check if we are near bottom

      if (
        currentY.current + 60 >
        flatListTopOffset.current + flatListHeight.current
      ) {
        listViewRef.current.scrollToOffset({
          offset: scrollOffset.current + 10,
          animated: false,
        });
        // Check if we are near the top
      } else if (
        scrollOffset.current > 0 &&
        currentY.current - 60 <= flatListTopOffset.current
      ) {
        listViewRef.current.scrollToOffset({
          offset: scrollOffset.current - 10,
          animated: false,
        });
      }
      // check y value see if we need to reorder
      const newIdx = yToIndex(currentY.current + rowHeight.current / 3);
      // const newIdx = yToIndex(currentY.current);

      if (currentIdx.current !== newIdx) {
        setData((data) => reOrder(data, currentIdx.current, newIdx));
        setDraggingIdx(newIdx);
        currentIdx.current = newIdx;
      }
      //animateList();
    });
  };
  //Takes in the gestureStates y0 value and determines which index/item was touched.
  const yToIndex = (y) => {
    // console.log(`scrollOffset-${scrollOffset.current}
    // y-${y}
    // flatListTopOffset-${flatListTopOffset.current}
    // rowHeight-${rowHeight.current}
    // `);
    const value = Math.floor(
      (scrollOffset.current + y - flatListTopOffset.current) / rowHeight.current
    );
    // console.log("value", value);
    // const value = Math.floor(
    //   (scrollOffset.current + y - flatListTopOffset.current) / rowHeight.current
    // );
    if (value < 0) {
      return 0;
    }
    if (value > data.length - 1) {
      return data.length - 1;
    }
    return value;
  };

  const renderRow = ({ item, index }, usePanResponder = true) => {
    return (
      <>
        <View style={styles.mainSwipe}>
          {isEditing === item.tagId ? (
            <TagRowEdit
              currTagValue={item.tagName}
              tagId={item.tagId}
              setIsEditing={setIsEditing}
            />
          ) : (
            <View
              onLayout={(e) =>
                (rowHeight.current = e.nativeEvent.layout.height)
              }
              style={{
                padding: 7,
                backgroundColor: "#ccc",
                flexDirection: "row",
                opacity: draggingIdx === index ? 0 : 1,
              }}
            >
              <View {...(usePanResponder ? _panResponder.panHandlers : {})}>
                <DragHandleIcon color="black" size={22} />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: "black",
                  marginLeft: 25,
                  flex: 1,
                }}
              >
                {item.tagName}
              </Text>
            </View>
          )}
        </View>
      </>
    );
  };
  return (
    <View
      style={styles.container}
      ref={viewRef}
      onLayout={(e) => {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          flatListTopOffset.current = pageY;
          console.log("VIEWRef", x, y, pageX, pageY, width, height);
        });
      }}
    >
      {dragging && (
        <Animated.View
          style={{
            top: pointY,
            position: "absolute",
            backgroundColor: "black",
            zIndex: 2,
            width: width,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            transform: [
              {
                scale: 1.03,
              },
            ],
          }}
        >
          {renderRow({ item: data[draggingIdx], index: -1 }, false)}
        </Animated.View>
      )}

      {/* <FlatList
        ref={flatListRef}
        scrollEnabled={!dragging}
        style={{
          width: "100%",
        }}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.tagId}
        onScroll={(e) => (scrollOffset.current = e.nativeEvent.contentOffset.y)}
        onLayout={(e) => {
          // flatListTopOffset.current = e.nativeEvent.layout.y;
          flatListHeight.current = e.nativeEvent.layout.height;
        }}
        scrollEventThrottle={16}
      /> */}
      <SwipeListView
        listViewRef={(ref) => {
          listViewRef.current = ref;
        }}
        useFlatList
        data={data}
        scrollEnabled={!dragging}
        onScroll={(e) => (scrollOffset.current = e.nativeEvent.contentOffset.y)}
        onLayout={(e) => {
          // flatListTopOffset.current = e.nativeEvent.layout.y;
          flatListHeight.current = e.nativeEvent.layout.height;
        }}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.tagId}
        renderItem={renderRow}
        renderHiddenItem={(rowData, rowMap) => {
          return (
            <>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(rowData.item.tagId);
                    rowMap[rowData.item.tagId].closeRow();
                  }}
                >
                  <Feather name="edit" size={25} />
                </TouchableOpacity>
              </View>
              <View style={[styles.backRightBtn, styles.deleteRightBtn]}>
                <TouchableOpacity
                  onPress={() => {
                    deleteTag(rowData.item.tagId);
                  }}
                >
                  <Feather name="trash-2" size={25} />
                </TouchableOpacity>
              </View>
            </>
          );
        }}
        leftOpenValue={75}
        rightOpenValue={-75}
        onRowOpen={(rowKey, rowMap) => {
          setTimeout(() => {
            if (rowMap[rowKey]) {
              rowMap[rowKey].closeRow();
            }
          }, 3000);
        }}
      />
    </View>
  );
};

export default TagViewPan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    width: Dimensions.get("window").width,
    borderTopColor: "black",
    borderTopWidth: 1,
  },
  mainSwipe: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.5,
    // height: 40,
    justifyContent: "center",
    position: "relative",
  },
  backRightBtn: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    top: 0,
    width: Dimensions.get("window").width / 3,
    // height: 40,
    // borderColor: "black",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
  },
  backRightBtnLeft: {
    backgroundColor: "lightblue",
    left: 0,
    alignItems: "flex-start",
    paddingLeft: 10,
  },
  deleteRightBtn: {
    backgroundColor: "#d11a2a",
    right: 0,
    margin: 0,
    alignItems: "flex-end",
    paddingRight: 10,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
  },
});
