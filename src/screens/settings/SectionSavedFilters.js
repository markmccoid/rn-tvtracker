import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/common/Buttons";
import { colors, commonStyles } from "../../globalStyles";

import SavedFiltersItem from "../../components/settings/SavedFiltersItem";

import DragDropEntry from "../../components/DragDropScrollView/DragDropEntry";
import { sortArray } from "../../components/DragDropScrollView/helperFunctions";

const ITEM_HEIGHT = 40;
// const VIEW_HEIGHT = 4 * ITEM_HEIGHT + 2;

const SectionSavedFilters = () => {
  const state = useOState();
  const actions = useOActions();
  const navigation = useNavigation();
  const { savedFilters } = state.oSaved;
  const { updateSavedFilterOrder } = actions.oSaved;

  const reSort = (positions, baseArray) => {
    // If there is only one item in our list, no need to resort, just noop
    if (Object.keys(positions).length <= 1) {
      return;
    }
    // positions is object { [id_of_filter]: index position }, so this: { 'id': 0, 'id': 1, ... }
    // Assumption is that positions object will ALWAYS have an entery for EVERY savedFilter id
    // Loop through the keys of the positions object (id of savedFilter), find the index of that filter
    // in the passed baseArray (savedFilterArray), then replace the index property in said filter with the
    // one from the positions object
    const updateArray = Object.keys(positions).map((id) => {
      const filterToUpdate = baseArray.findIndex((filter) => filter.id === id);
      return { ...baseArray[filterToUpdate], index: positions[id] };
    });
    // Update saved filters
    updateSavedFilterOrder(updateArray);
  };
  const updatedFilters = savedFilters;
  const VIEW_HEIGHT = Math.min(savedFilters.length, 4) * ITEM_HEIGHT + 2;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={commonStyles.headerText}>{`${savedFilters.length} Saved Filters`}</Text>
        <Button
          title="Create"
          wrapperStyle={{ width: 100 }}
          onPress={() => navigation.navigate("CreateSavedFilter")}
        />
      </View>

      <View
        style={{
          height: VIEW_HEIGHT,
          borderWidth: 1,
          borderColor: colors.listBorder,
          backgroundColor: "#ddd",
        }}
      >
        <DragDropEntry
          //scrollStyles={{ width: 300, borderWidth: 1, borderColor: "red" }}
          // updatePositions={(positions) => reSort(positions, savedFilters)}
          updatePositions={(positions) =>
            updateSavedFilterOrder(sortArray(positions, savedFilters, "index"))
          }
          itemHeight={ITEM_HEIGHT}
        >
          {savedFilters.map((item) => {
            return (
              <View
                style={{
                  flexGrow: 1,
                  borderColor: colors.listItemBorder,
                  borderWidth: 1,
                  justifyContent: "center",
                }}
                id={item.id}
                key={item.id}
              >
                <SavedFiltersItem savedFilter={item} />
              </View>
            );
          })}
        </DragDropEntry>
      </View>
    </View>
  );
};

export default SectionSavedFilters;

const styles = StyleSheet.create({
  container: {},
  headerContainer: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
