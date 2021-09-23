import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { MotiPressable } from "@motify/interactions";
import { colors, styleHelpers } from "../../globalStyles";

/** PressableButton
  Right now, type simply changes the background color
  They style you pass in takes precedent over the base styles.
  You will need to pass in the text/icon that you want to as part of the button
*/
type Props = {
  onPress: () => void;
  type?: "primary" | "alert";
  style?: ViewStyle;
};

const PressableButton: React.FC<Props> = ({ children, onPress, type, style }) => {
  return (
    <MotiPressable
      style={[styles.buttonStructure, styles[type], style]}
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
    >
      {children}
    </MotiPressable>
  );
};

const styles = StyleSheet.create({
  buttonStructure: {
    ...styleHelpers.buttonShadow,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  primary: {
    backgroundColor: colors.buttonPrimary,
  },
  alert: {
    backgroundColor: colors.mutedRed,
  },
});
export default PressableButton;
