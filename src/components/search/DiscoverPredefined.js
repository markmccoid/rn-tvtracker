import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { predefinedTypesEnum } from "../../statemachines/discoverMoviesMachine";
import { colors } from "../../globalStyles";

// Style what a selected vs not selected item looks like
const selectedStyle = { backgroundColor: colors.primary, color: "#fff" };
const notSelectedStyle = { backgroundColor: "white", color: "black" };
const predefinedItemStyle = (queryType, predefinedType, predefinedItem) =>
  predefinedType === predefinedItem && queryType === "predefined"
    ? selectedStyle
    : notSelectedStyle;

const DiscoverPredefined = ({ queryType, predefinedType, setPredefined }) => {
  const predefinedTypesArray = Object.keys(predefinedTypesEnum).map(
    (key) => predefinedTypesEnum[key]
  );

  return (
    <View
      style={{ flexDirection: "row", marginHorizontal: 10, justifyContent: "space-around" }}
    >
      {predefinedTypesArray.map((predefinedItem) => (
        <View
          key={predefinedItem}
          style={[
            styles.itemStyle,
            predefinedItemStyle(queryType, predefinedType, predefinedItem),
          ]}
        >
          <TouchableOpacity onPress={() => setPredefined(predefinedItem)}>
            <Text style={predefinedItemStyle(queryType, predefinedType, predefinedItem)}>
              {predefinedItem}
            </Text>
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
