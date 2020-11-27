import { last } from "lodash";
import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
import { State, LongPressGestureHandler } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

import UserRating from "../../../components/UserRating/UserRating";
const { width, height } = Dimensions.get("window");
const positionFactor = Math.floor((width - 50) / 10);

const LongTouchUserRating = ({ userRating, updateUserRating }) => {
  const forceVal = React.useRef(new Animated.Value(0)).current;
  const xPos = React.useRef(new Animated.Value(0)).current;
  // Used to set User Rating Text higher when gesture active
  // Turned on in _onGestureEvent and off in the "EndXPosAnim" callback.
  const [gestureActive, setGestureActive] = React.useState(false);
  const [currRating, setCurrRating] = React.useState(0);

  //Animation on gesture START/activation
  const gestureStartAnim = () =>
    Animated.spring(forceVal, {
      toValue: 1,
      bounciness: 15,
      speed: 10,
      useNativeDriver: true,
    }).start();
  //Animation on gesture END
  const gestureEndAnim = () =>
    Animated.timing(forceVal, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setGestureActive(false));
  //Animation on Gesture End for translateX
  const EndXPosAnim = () =>
    Animated.spring(xPos, {
      toValue: 0,
      damping: 10,
      useNativeDriver: true,
    }).start();

  const _onGestureEvent = (event) => {
    let { absoluteY, y, absoluteX, x, oldState, state } = event.nativeEvent;
    setGestureActive(true);
    xPos.setValue(absoluteX - 66);
    let calcCurrRating =
      Math.floor(absoluteX / positionFactor) >= 10
        ? 10
        : Math.floor(absoluteX / positionFactor);
    if (currRating !== calcCurrRating) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrRating(calcCurrRating);
  };

  const _onHandlerStateChange = (event) => {
    // console.log(State.ACTIVE, State.UNDETERMINED, State.BEGAN, State.END);
    // Event is over
    let { oldState, state } = event.nativeEvent;

    // When long gesture is actived do this
    if (state === State.ACTIVE) {
      gestureStartAnim();
      // Haptics.selectionAsync();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // When long gesture ends, do this
    if (state === State.END) {
      gestureEndAnim();
      EndXPosAnim();
      updateUserRating(currRating);
    }
  };

  React.useEffect(() => {
    setCurrRating(userRating);
  }, [userRating]);

  return (
    <View>
      <LongPressGestureHandler
        feedbackOnActivation
        minDurationMs={500}
        maxDist={width}
        onGestureEvent={_onGestureEvent}
        onHandlerStateChange={_onHandlerStateChange}
      >
        <View style={{ position: "absolute", bottom: -25, paddingBottom: 30 }}>
          <Animated.View
            style={[
              styles.box,
              gestureActive ? { justifyContent: "flex-start" } : { justifyContent: "center" },
              {
                transform: [
                  { translateX: xPos },
                  {
                    translateY: forceVal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -35],
                      extrapolate: "clamp",
                    }),
                  },
                  { scale: Animated.add(1, forceVal) },
                ],
              },
            ]}
          >
            <Text style={styles.userRating}>{currRating}</Text>
          </Animated.View>
        </View>
      </LongPressGestureHandler>
    </View>
  );
};

export default LongTouchUserRating;

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: "yellow",
    zIndex: 200,
    borderColor: "#777",
    borderWidth: 1,
  },
  userRating: {
    fontSize: 18,
    fontWeight: "800",
  },
});
