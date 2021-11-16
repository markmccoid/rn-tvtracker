import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import SettingsSortItem from "../../components/settings/SettingsSortItem";
import { useOActions, useOState } from "../../store/overmind";
import DragDropEntry, { sortArray } from "@markmccoid/react-native-drag-and-order";
import { sortDefinitions } from "../../store/oSaved/defaultConstants.ts";

import { colors, commonStyles } from "../../globalStyles";

const SectionSort = () => {
  const state = useOState();
  const actions = useOActions();
  const { defaultSort } = state.oSaved.settings;
  const { updateDefaultSortItem, updateDefaultSortOrder } = actions.oSaved;

  const ITEM_HEIGHT = 65;

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 5 }}>
        <Text style={commonStyles.headerText}>Set Default Sort</Text>
        <Text>Choose a default sort order for viewing movies.</Text>
      </View>
      <DragDropEntry
        scrollStyles={{ borderWidth: 1, borderColor: colors.listBorder }}
        updatePositions={(positions) =>
          updateDefaultSortOrder(sortArray(positions, defaultSort, { positionField: "index" }))
        }
        itemHeight={ITEM_HEIGHT}
      >
        {defaultSort.map((item) => {
          item = { ...item, ...sortDefinitions[item.id] };
          return (
            <View
              style={{
                flexGrow: 1,
                borderColor: colors.listItemBorder,
                borderWidth: 1,
                justifyContent: "center",
                backgroundColor: "white",
                height: ITEM_HEIGHT,
              }}
              id={item.id}
              key={item.id}
            >
              <SettingsSortItem
                key={item.title}
                id={item.id}
                title={item.title}
                type={item.type}
                active={item.active}
                direction={item.sortDirection}
                updateDefaultSortItem={updateDefaultSortItem}
              />
            </View>
          );
        })}
      </DragDropEntry>
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
