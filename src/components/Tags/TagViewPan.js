import React from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import { useDimensions } from "@react-native-community/hooks";
import { useOState, useOActions } from "../../store/overmind";
import { DragHandleIcon } from "../common/Icons";
import TagRowEditOverlay from "./TagRowEditOverlay";
import { colors } from "../../globalStyles";

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
  const scrollOffset = React.useRef(0);
  const rowHeight = React.useRef(0);
  const currentIdx = React.useRef(-1);
  const startingIdx = React.useRef(-1);
  const active = React.useRef(false);
  const flatListHeight = React.useRef(0);
  let flatListRef = React.useRef();
  const viewRef = React.useRef();
  const { width, height } = useDimensions().window;
  //Get tag data from Overmind
  const state = useOState();
  const actions = useOActions();
  // tagData = [ { tagId, tagName }, ...]
  const [data, setData] = React.useState();
  const { tagData } = state.oSaved;
  const { updateTags, deleteTag } = actions.oSaved;

  // Sets our local data array whenever Overmind's data changes length
  // We only need to update the local array if an tag is ADDED or REMOVED
  // OR EDITED
  React.useEffect(() => {
    if (!isEditing) {
      setData([...tagData]);
    }
  }, [tagData.length, isEditing]);

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
      startingIdx.current = currentIdx.current;
      active.current = true;

      pointY.setValue(gestureState.y0 - flatListTopOffset.current - rowHeight.current / 2);
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
      pointY.setValue(gestureState.moveY - flatListTopOffset.current - rowHeight.current / 2);
      animateList();
    },
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => {
      // The user has released all touches while this view is the
      // responder. This typically means a gesture has succeeded
      reset();
      if (currentIdx.current !== startingIdx.current) {
        updateTags(data);
      }
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

      if (currentY.current + 60 > flatListTopOffset.current + flatListHeight.current) {
        flatListRef.current.scrollToOffset({
          offset: scrollOffset.current + 10,
          animated: false,
        });
        // Check if we are near the top
      } else if (
        scrollOffset.current > 0 &&
        currentY.current - 60 <= flatListTopOffset.current
      ) {
        flatListRef.current.scrollToOffset({
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
          {isEditing === item.tagId && (
            <TagRowEditOverlay
              isVisible={true}
              currTagValue={item.tagName}
              tagId={item.tagId}
              setIsEditing={setIsEditing}
            />
          )}
          <View
            onLayout={(e) => (rowHeight.current = e.nativeEvent.layout.height)}
            style={{
              backgroundColor: colors.tagListbg,
              flexDirection: "row",
              alignItems: "center",
              opacity: draggingIdx === index ? 0 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: colors.tagListfg,
                marginLeft: 15,
                padding: 10,
                flex: 1,
              }}
            >
              {item.tagName}
            </Text>
            <View
              style={{
                padding: 10,
                margin: 0,
              }}
              {...(usePanResponder ? _panResponder.panHandlers : {})}
            >
              <DragHandleIcon color="black" size={30} />
            </View>
          </View>
        </View>
      </>
    );
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
      <View
        style={styles.container}
        ref={viewRef}
        onLayout={(e) => {
          viewRef.current.measure((x, y, width, height, pageX, pageY) => {
            flatListTopOffset.current = pageY;
            // console.log("VIEWRef", x, y, pageX, pageY, width, height);
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
            flatListRef.current = ref;
          }}
          useFlatList
          style={{ backgroundColor: colors.background }}
          data={data}
          scrollEnabled={!dragging}
          onScroll={(e) => (scrollOffset.current = e.nativeEvent.contentOffset.y)}
          onLayout={(e) => {
            // flatListTopOffset.current = e.nativeEvent.layout.y;
            flatListHeight.current = e.nativeEvent.layout.height;
          }}
          scrollEventThrottle={16}
          keyExtractor={(item) => item.tagId}
          renderItem={(props) => renderRow(props, true)}
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
    </KeyboardAvoidingView>
  );
};

export default TagViewPan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    width: Dimensions.get("window").width,
    borderTopColor: "black",
    borderTopWidth: 0.5,
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
  },
  mainSwipe: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 0.5,
    // height: 40,
    // justifyContent: "center",
    // alignItems: "center",
    // position: "relative",
  },
  backRightBtn: {
    position: "absolute",
    bottom: 0,
    justifyContent: "center",
    top: 0,
    // paddingVertical: 10,
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
