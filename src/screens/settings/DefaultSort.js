import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import SettingsSortItem from "./SettingsSortItem";
import { useOActions, useOState } from "../../store/overmind";

const DefaultSort = () => {
  const state = useOState();
  const actions = useOActions();
  const { defaultSort } = state.oSaved.settings;
  const { updateDefaultSortItem } = actions.oSaved;

  return (
    <ScrollView style={styles.container}>
      {defaultSort &&
        defaultSort.map((sortItem) => (
          <SettingsSortItem
            title={sortItem.title}
            key={sortItem.title}
            active={sortItem.active}
            direction={sortItem.sortDirection}
            updateDefaultSortItem={updateDefaultSortItem}
          />
        ))}
    </ScrollView>
  );
};

export default DefaultSort;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginRight: 5,
  },
});
