import React from "react";
import Animated from "react-native-reanimated";

//*------------------------
//* Bottomsheet Background
export const CustomBackground = ({ animatedIndex, style }) => {
  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: "#eee",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#777",
        },
      ]}
    />
  );
};

//*--- Snap Points and Object ---------------------

// This defines the four snap points.
// Changing here will change the snapEnum and snapPoints
const snapObj = {
  hidden: 15,
  simpleSearch: 150,
  keyboard: 380,
  max: "90%",
};

// return an object we can use to call the snapTo function with
// snapTo(snapEnum.keyboard) where snapEnum.keyboard would equal 2
export const snapEnum = Object.keys(snapObj).reduce(
  (final, key, idx) => ({ ...final, [key]: idx }),
  {}
);

export const snapPoints = [
  snapObj.hidden,
  snapObj.simpleSearch,
  snapObj.keyboard,
  snapObj.max,
];
