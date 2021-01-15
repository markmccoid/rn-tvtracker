import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import _ from "lodash";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../../components/common/Buttons";
import { colors, commonStyles } from "../../globalStyles";

import SavedFiltersItem from "../../components/settings/SavedFiltersItem";

import DragToSort from "../../components/dragToSort/DragToSort";

const ITEM_HEIGHT = 40;

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
      <DragToSort
        itemDetail={{ height: ITEM_HEIGHT }}
        reSort={(positions) => reSort(positions, savedFilters)}
        data={savedFilters}
        itemsToShow={4}
        renderItem={({ item }) => {
          return (
            <View
              style={{
                flexGrow: 1,
                borderColor: colors.listItemBorder,
                borderWidth: 1,
                justifyContent: "center",
              }}
              id={item.id}
            >
              <SavedFiltersItem savedFilter={item} />
            </View>
          );
        }}
      />
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
