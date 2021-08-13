import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { CaretRightIcon } from "./Icons";
import { MotiView } from "moti";

const OpenButton = ({ isOpen, toggleFunction, transition = { type: "spring" } }) => {
  // const [isOpen, setIsOpen] = React.useState(false);
  return (
    <MotiView
      animate={{ rotate: isOpen ? "90deg" : "0deg" }}
      transition
      // transition={{ type: "timing", duration: 400 }}
    >
      <Pressable style={{ paddingHorizontal: 15 }} onPress={toggleFunction}>
        <CaretRightIcon size={25} />
      </Pressable>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "yellow",
    borderLeftWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default OpenButton;
