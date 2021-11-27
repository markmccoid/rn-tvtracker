import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { ExpandDownIcon, CollapseUpIcon } from "../common/Icons";

/**
 * Component will take a component as a child and toggle displaying or hiding
 * the content.
 * Will accept a passed "title" prop to display as title
 * Will also accept "startOpen" prop to determine if container is in
 * open state when initially displayed.
 *
 */
const HiddenContainer = ({ children, style, title, startOpen = false }) => {
  const [viewContents, setViewContents] = useState(startOpen);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff85",
        borderTopColor: "#777",
        borderBottomColor: "#aaa",
        borderBottomWidth: viewContents ? 1 : 0,
        borderTopWidth: 1,
        marginVertical: 5,
      }}
    >
      <Pressable
        style={({ pressed }) => [
          {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 10,
            borderBottomColor: "#777",
            borderBottomWidth: 1,
            backgroundColor: "#ffffff77",
            opacity: pressed ? 0.6 : 1,
            paddingHorizontal: 25,
          },
        ]}
        onPress={() => setViewContents((prev) => !prev)}
      >
        <View
          style={{
            flex: 1,
            paddingRight: 5,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View>
          {!viewContents ? (
            <ExpandDownIcon style={{ marginTop: 5 }} size={20} />
          ) : (
            <CollapseUpIcon style={{ marginTop: 5 }} size={20} />
          )}
        </View>
      </Pressable>
      {viewContents && <View style={{ ...style }}>{children}</View>}
    </View>
  );
};

export default HiddenContainer;

const styles = StyleSheet.create({});
