import React from "react";
import { StyleSheet, ScrollView, View, Dimensions } from "react-native";
import { useOState } from "../../../store/overmind";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import { Animated, useSharedValue } from "react-native-reanimated";
import SavedFiltersItem from "../SavedFiltersItem";

import SortableList from "../sortable/SortableList";
import SortableItem from "./SortableItem";
import { TouchableOpacity } from "react-native-gesture-handler";

const ITEM_HEIGHT = 40.333;
const { width, height } = Dimensions.get("window");

const SavedFiltersSort = () => {
  const state = useOState();
  const { savedFilters } = state.oSaved;
  console.log(
    "SaveFilterSort",
    savedFilters.map((el) => el.name)
  );
  const reSort = async (positions) => {
    "worklet";

    Object.keys(positions).map((key) => console.log(key, positions[key]));
  };
  return (
    <View style={{ position: "relative" }}>
      <SortableList item={{ width, height: ITEM_HEIGHT + 5 }} reSort={reSort}>
        {savedFilters.map((item, index) => {
          return (
            <View style={styles.item} key={index} id={item.id}>
              <SavedFiltersItem savedFilter={item} />
              {/* <Text>{item.name}</Text> */}
            </View>
          );
        })}
      </SortableList>
    </View>
  );
};

export default SavedFiltersSort;

const styles = StyleSheet.create({
  item: {
    height: ITEM_HEIGHT,
    width: "95%",
    borderColor: "black",
    borderWidth: 1,
    // flex: 1,
    // alignItems: "center",
    // backgroundColor: "red",
    // marginTop: 32,
  },
});
