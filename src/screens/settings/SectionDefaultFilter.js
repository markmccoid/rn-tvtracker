import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import DropDownPicker from "react-native-dropdown-picker";

import { colors, commonStyles } from "../../globalStyles";

const SectionDefaultFilter = () => {
  const state = useOState();
  const actions = useOActions();
  const { savedFilters, settings } = state.oSaved;
  const defaultFilter = settings?.defaultFilter;

  const { setDefaultFilter } = actions.oSaved;
  const filterItems = savedFilters.map((filter) => ({
    label: filter.name,
    value: filter.id,
  }));
  //Add an option to have No filter on startup
  filterItems.unshift({ label: "None", value: undefined });
  return (
    <View>
      <View style={{ marginBottom: 5 }}>
        <Text style={commonStyles.headerText}>Set Default Filter</Text>
        <Text>Choose a saved filter to be run when app starts.</Text>
      </View>
      <DropDownPicker
        items={filterItems}
        defaultValue={defaultFilter}
        placeholder="Select a Default Filter"
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
        onChangeItem={(item) => setDefaultFilter(item.value)}
      />
    </View>
  );
};

export default SectionDefaultFilter;
