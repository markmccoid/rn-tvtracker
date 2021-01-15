import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import SettingsSortItem from "../../components/settings/SettingsSortItem";
import { useOActions, useOState } from "../../store/overmind";
import DragToSort from "../../components/dragToSort/DragToSort";
import { colors, commonStyles } from "../../globalStyles";

const SectionSort = () => {
  const state = useOState();
  const actions = useOActions();
  const { defaultSort } = state.oSaved.settings;
  const { updateDefaultSortItem, updateDefaultSortOrder } = actions.oSaved;

  const ITEM_HEIGHT = 65;

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
    updateDefaultSortOrder(updateArray);
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 5 }}>
        <Text style={commonStyles.headerText}>Set Default Sort</Text>
        <Text>Choose a default sort order for viewing movies.</Text>
      </View>

      <DragToSort
        itemDetail={{ height: ITEM_HEIGHT }}
        reSort={(positions) => reSort(positions, defaultSort)}
        data={defaultSort}
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
              key={item.id}
            >
              <SettingsSortItem
                key={item.title}
                title={item.title}
                type={item.type}
                active={item.active}
                direction={item.sortDirection}
                updateDefaultSortItem={updateDefaultSortItem}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default SectionSort;

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
    marginTop: 5,
  },
});
