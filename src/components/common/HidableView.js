import React from "react";

import { View } from "react-native";

const HidableView = ({ children, visible, style, ...rest }) => {
  if (!visible) {
    return null;
  }
  return (
    <View {...rest} style={style}>
      {children}
    </View>
  );
};

export default HidableView;
