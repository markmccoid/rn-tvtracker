import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useOState, useOActions } from "../../../store/overmind";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../common/Buttons";

import SavedFiltersItem from "../SavedFiltersItem";

import DragToSort from "./DragToSort";

const ITEM_HEIGHT = 40;
const { width, height } = Dimensions.get("window");

const SavedFiltersDragMain = () => {
  const state = useOState();
  const actions = useOActions();
  const navigation = useNavigation();
  const { savedFilters } = state.oSaved;
  const { updateSavedFilterOrder } = actions.oSaved;

  const reSort = (positions, baseArray) => {
    // positions is object { [id_of_filter]: index position }, so this: { 'id': 0, 'id': 1, ... }
    // Assumption is that positions object will ALWAYS have an entery for EVERY savedFilter id
    // Loop through the keys of the positions object (id of savedFilter), find the index of that filter
    // in the passed baseArray (savedFilterArray), then replace the index property in said filter with the
    // one from the positions object
    const updateArray = Object.keys(positions).map((id) => {
      filterToUpdate = baseArray.findIndex((filter) => filter.id === id);
      return { ...baseArray[filterToUpdate], index: positions[id] };
    });
    // Update saved filters
    updateSavedFilterOrder(updateArray);
  };
  return (
    <View style={styles.container}>
      <DragToSort
        item={{ height: ITEM_HEIGHT }}
        reSort={(positions) => reSort(positions, savedFilters)}
        data={savedFilters}
        itemsToShow={5}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width: "90%",
                borderColor: "#ccc",
                borderWidth: 1,
              }}
              id={item.id}
            >
              <SavedFiltersItem savedFilter={item} />
            </View>
          );
        }}
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          title="Create"
          wrapperStyle={{ width: 100 }}
          onPress={() => navigation.navigate("CreateSavedFilter")}
        />
      </View>
    </View>
  );
};

export default SavedFiltersDragMain;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  item: {
    height: ITEM_HEIGHT,
    width: "95%",
    borderColor: "#ddd",
    borderWidth: 1,
    // flex: 1,
    // alignItems: "center",
    // backgroundColor: "red",
    // marginTop: 32,
  },
});
