import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import SettingsSortItem from "../../components/settings/SettingsSortItem";
import { useOActions, useOState } from "../../store/overmind";
import DragDropEntry, { sortArray } from "@markmccoid/react-native-drag-and-order";
import {
  sortDefinitions,
  SortObjectItem,
  SortDefinitionDetails,
  FullSortObject,
} from "../../store/oSaved/defaultConstants";
import _ from "lodash";
import { colors, commonStyles } from "../../globalStyles";

type Props = {
  newSort: SortObjectItem[];
  setNewSort: React.Dispatch<React.SetStateAction<SortObjectItem[]>>;
};
const SavedFilterSort = ({ newSort, setNewSort }: Props) => {
  // const state = useOState();
  // const { defaultSort } = state.oSaved.settings;

  // const [newSort, setNewSort] = React.useState<SortObjectItem[]>(defaultSort);
  // const actions = useOActions();
  // const { updateDefaultSortItem, updateDefaultSortOrder } = actions.oSaved;

  const ITEM_HEIGHT = 65;
  // console.log(
  //   "New sort",
  //   newSort.map((item) => `${item.id}--${item.index}--${item.active}--${item.sortDirection}`)
  // );

  //* Update the order of the sort items
  const updateSortOrder = (newSortOrder) => {
    setNewSort(
      _.sortBy(newSortOrder, ["index"]).map((sortItem, index) => ({
        ...sortItem,
        index,
      }))
    );
  };
  //* Update the attributes of a changed sort Item (active, up/down)
  const updateSortItem = (payload) => {
    const { id, active, direction } = payload;
    //Update the settings.defaultSort AND currentSort
    const newSortArray = newSort.map((sortItem) => {
      if (sortItem.id === id) {
        return { ...sortItem, active, sortDirection: direction };
      }
      return sortItem;
    });
    setNewSort(newSortArray);
  };
  //---
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 5 }}>
        <Text style={commonStyles.headerText}>Set Filter Sort</Text>
        <Text>Choose a default sort order for this filter.</Text>
      </View>
      <DragDropEntry
        scrollStyles={{ borderWidth: 1, borderColor: colors.listBorder }}
        updatePositions={(positions) =>
          updateSortOrder(
            sortArray(positions, newSort, { idField: "id", positionField: "index" })
          )
        }
        itemHeight={ITEM_HEIGHT}
      >
        {newSort.map((item) => {
          const fullItem = { ...item, ...sortDefinitions[item.id] } as FullSortObject;
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
              id={fullItem.id}
              key={fullItem.id}
            >
              <SettingsSortItem
                key={fullItem.title}
                id={fullItem.id}
                title={fullItem.title}
                type={fullItem.type}
                active={fullItem.active}
                direction={fullItem.sortDirection}
                updateDefaultSortItem={updateSortItem}
              />
            </View>
          );
        })}
      </DragDropEntry>
    </View>
  );
};

export default SavedFilterSort;

const styles = StyleSheet.create({
  container: {
    marginRight: 5,
    marginTop: 5,
  },
});
