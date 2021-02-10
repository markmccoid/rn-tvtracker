import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { predefinedTypesEnum } from "../../statemachines/discoverMoviesMachine";

const DiscoverPredefined = ({ queryType, predefinedType, setPredefined }) => {
  const predefinedTypesArray = Object.keys(predefinedTypesEnum).map(
    (key) => predefinedTypesEnum[key]
  );

  // Style what a selected vs not selected item looks like
  const selectedStyle = { backgroundColor: "#ccc" };
  const notSelectedStyle = { backgroundColor: "white" };
  const predefinedItemStyle = (predefinedItem) =>
    predefinedType === predefinedItem && queryType === "predefined"
      ? selectedStyle
      : notSelectedStyle;

  return (
    <View
      style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-around" }}
    >
      {predefinedTypesArray.map((predefinedItem) => (
        <View
          key={predefinedItem}
          style={[styles.itemStyle, predefinedItemStyle(predefinedItem)]}
        >
          <TouchableOpacity onPress={() => setPredefined(predefinedItem)}>
            <Text>{predefinedItem}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 5,
    paddingHorizontal: 10,
    // marginHorizontal: 4,
    borderRadius: 8,
  },
});

export default DiscoverPredefined;
