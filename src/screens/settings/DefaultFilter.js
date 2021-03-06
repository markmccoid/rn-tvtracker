import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useOvermind } from "../../store/overmind";
import DropDownPicker from "react-native-dropdown-picker";

const DefaultFilter = () => {
  const { state, actions } = useOvermind();
  const { savedFilters, settings } = state.oSaved;
  const defaultFilter = settings?.defaultFilter;

  const { setDefaultFilter } = actions.oSaved;
  const filterItems = savedFilters.map((filter) => ({
    label: filter.name,
    value: filter.id,
  }));
  //Add an option to have No filter on startup
  filterItems.unshift({ label: "None", value: "" });
  return (
    <DropDownPicker
      items={filterItems}
      defaultValue={defaultFilter}
      placeholder="Select a Default Filter"
      containerStyle={{ height: 40 }}
      onChangeItem={(item) => setDefaultFilter(item.value)}
    />
  );
};

export default DefaultFilter;
