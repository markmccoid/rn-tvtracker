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
    <View style={styles.container}>
      {defaultSort &&
        defaultSort.map((sortItem) => (
          <SettingsSortItem
            key={sortItem.title}
            title={sortItem.title}
            type={sortItem.type}
            active={sortItem.active}
            direction={sortItem.sortDirection}
            updateDefaultSortItem={updateDefaultSortItem}
          />
        ))}
    </View>
  );
};

export default DefaultSort;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginRight: 5,
    marginTop: 5,
  },
});
