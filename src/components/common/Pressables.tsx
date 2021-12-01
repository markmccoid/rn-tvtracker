import React from "react";
import { View, Text, StyleSheet, ViewStyle, Pressable } from "react-native";
import { colors, styleHelpers } from "../../globalStyles";

/** PressableButton
  Right now, type simply changes the background color
  They style you pass in takes precedent over the base styles.
  You will need to pass in the text/icon that you want to as part of the button
*/
type TouchableOpacityProps = {
  onPress: () => void;
  activeOpacity?: number;
  style?: ViewStyle;
  disabled?: boolean;
};

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  onPress,
  activeOpacity = 0.5,
  style,
  disabled = false,
}) => {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        {
          // backgroundColor: pressed ? "rgb(210, 230, 255)" : undefined,
          opacity: pressed ? activeOpacity : 1,
          ...style,
        },
      ]}
      onPress={onPress}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({});
