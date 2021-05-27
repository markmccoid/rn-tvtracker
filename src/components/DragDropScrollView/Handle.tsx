import React from "react";
import { View, StyleProp, TextStyle } from "react-native";
import { DragHandleIcon } from "../common/Icons";
import { colors } from "../../globalStyles";

const DefaultHandle: React.FC = () => (
  <View
    style={{
      borderWidth: 1,
      borderColor: colors.listItemBorder,
      height: "100%",
      justifyContent: "center",
      paddingHorizontal: 5,
    }}
  >
    <DragHandleIcon size={25} />
  </View>
);

export default DefaultHandle;
