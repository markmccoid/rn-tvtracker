import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import DropDownPicker from "react-native-dropdown-picker";

import { colors, commonStyles } from "../../globalStyles";

const SectionDefaultFilter = () => {
  const [selectedItem, setSelectedItem] = React.useState("");
  const state = useOState();
  const actions = useOActions();
  const { savedFilters, settings } = state.oSaved;
  const defaultFilter = settings?.defaultFilter;

  const { setDefaultFilter } = actions.oSaved;
  const filterItems = savedFilters.map((filter) => ({
    label: filter.name,
    value: filter.id,
  }));
  filterItems.unshift({ label: "Clear Default Filter", value: "none" });

  let controller;

  // When "Clear Default Filter" selected, sent null and reset list, else set selected filter
  React.useEffect(() => {
    if (selectedItem === "none") {
      setDefaultFilter();
      controller.reset();
    } else if (selectedItem) {
      setDefaultFilter(selectedItem);
    }
  }, [selectedItem]);

  return (
    <View>
      <View style={{ marginBottom: 5 }}>
        <Text style={commonStyles.headerText}>Set Default Filter</Text>
        <Text>Choose a saved filter to be run when app starts.</Text>
      </View>
      <DropDownPicker
        items={filterItems}
        defaultValue={defaultFilter}
        controller={(ins) => (controller = ins)}
        placeholder="Select a Default Filter"
        itemStyle={{ justifyContent: "flex-start" }}
        containerStyle={{
          height: 40,
          borderWidth: 1,
          borderColor: colors.listBorder,
        }}
        dropDownStyle={{
          backgroundColor: colors.listItemBackground,
          borderWidth: 1,
          borderColor: colors.listBorder,
        }}
        activeLabelStyle={{ color: colors.includeGreen, fontWeight: "bold" }}
        onChangeItem={(item) => setSelectedItem(item.value)}
      />
    </View>
  );
};

export default SectionDefaultFilter;
