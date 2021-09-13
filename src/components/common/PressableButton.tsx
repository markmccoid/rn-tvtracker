import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { MotiPressable } from "@motify/interactions";

type Props = {
  onPress: () => void;
  style?: ViewStyle;
};
const PressableButton: React.FC<Props> = ({ children, onPress, style }) => {
  return (
    <MotiPressable
      style={style}
      onPress={onPress}
      animate={React.useCallback(({ hovered, pressed }) => {
        "worklet";

        return {
          opacity: hovered || pressed ? 0.9 : 1,
          transform: [
            { translateX: hovered || pressed ? 2 : 0 },
            { translateY: hovered || pressed ? 2 : 0 },
          ],
        };
      }, [])}

      // style={({ pressed }) => [
      //   {
      //     // backgroundColor: pressed ? "#ccc" : colors.backgroundColor,
      //     // padding: 5,
      //     // borderRadius: 10,
      //     // marginLeft: 10,
      //     transform: [{ translateY: pressed ? 2 : 0 }, { translateX: pressed ? 2 : 0 }],
      //   },
      // ]}
    >
      {children}
    </MotiPressable>
  );
};

export default PressableButton;
