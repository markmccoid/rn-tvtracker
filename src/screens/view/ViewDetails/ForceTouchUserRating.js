import { last } from "lodash";
import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
import { State, ForceTouchGestureHandler } from "react-native-gesture-handler";

import UserRating from "../../../components/UserRating/UserRating";
const { width, height } = Dimensions.get("window");
const positionFactor = Math.floor((width - 50) / 10);

const ForceTouchUserRating = ({ userRating, updateUserRating }) => {
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
    let { force, absoluteY, y, absoluteX, x, oldState, state } = event.nativeEvent;
    setGestureActive(true);
    xPos.setValue(absoluteX - 66);
    if (Math.floor(absoluteX / positionFactor) >= 10) {
      setCurrRating(10);
    } else {
      setCurrRating(Math.floor(absoluteX / positionFactor));
    }
  };

  const _onHandlerStateChange = (event) => {
    // console.log(State.ACTIVE, State.UNDETERMINED, State.BEGAN, State.END);
    // Event is over

    let { oldState, state } = event.nativeEvent;
    if (state === State.BEGAN) {
      gestureStartAnim();
    }
    if (state === State.END) {
      gestureEndAnim();
    }
    if (oldState === State.ACTIVE) {
      //forceVal.setValue(0);
      //xPos.setValue(0);
      EndXPosAnim();
      updateUserRating(currRating);
    }
  };

  React.useEffect(() => {
    setCurrRating(userRating);
  }, [userRating]);

  // If force touch not available, don't return anything
  // Calling component needs to have fallback (UserRating component)
  if (!ForceTouchGestureHandler.forceTouchAvailable) {
    return null;
  }
  return (
    <View>
      <ForceTouchGestureHandler
        feedbackOnActivation
        minForce={0.5}
        onGestureEvent={_onGestureEvent}
        onHandlerStateChange={_onHandlerStateChange}
      >
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
      </ForceTouchGestureHandler>
    </View>
  );
};

export default ForceTouchUserRating;

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
