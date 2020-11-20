import { last } from "lodash";
import React from "react";
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Animated } from "react-native";
import { State, ForceTouchGestureHandler } from "react-native-gesture-handler";

import UserRating from "./../../../components/UserRating/UserRating";
const { width, height } = Dimensions.get("window");
const positionFactor = Math.floor((width - 50) / 10);

const SetUserRating = ({ setShowUserRating, userRating, updateUserRating, movieId }) => {
  const force = new Animated.Value(0);
  const xPos = React.useRef(new Animated.Value(0)).current;
  const [scale, setScale] = React.useState(1);
  const [currRating, setCurrRating] = React.useState(0);

  const _onGestureEvent = (event) => {
    let { force, absoluteY, y, absoluteX, x, oldState, state } = event.nativeEvent;

    xPos.setValue(absoluteX - 66);
    setScale(1.5);
    setShowUserRating(true);
    setCurrRating(Math.floor(absoluteX / positionFactor));
  };

  const _onHandlerStateChange = (event) => {
    // console.log(State.ACTIVE, State.UNDETERMINED, State.BEGAN, State.END);
    if (event.nativeEvent.oldState === State.ACTIVE) {
      xPos.setValue(0);
      setScale(1);
      // props.setShowUserRating(false);
      updateUserRating(currRating);
      setShowUserRating(false);
    }
  };

  React.useEffect(() => {
    setCurrRating(userRating);
  }, [userRating]);

  if (!ForceTouchGestureHandler.forceTouchAvailable) {
    return <UserRating movieId={movieId} />;
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
            {
              transform: [
                { translateX: xPos },
                { translateY: scale === 1 ? 0 : -35 },
                { scale },
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

export default SetUserRating;

const styles = StyleSheet.create({
  box: {
    width: 60,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "yellow",
    zIndex: 200,
  },
  userRating: {
    fontSize: 18,
    fontWeight: "800",
  },
});
