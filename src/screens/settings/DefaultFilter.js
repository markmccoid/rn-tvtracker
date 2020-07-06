import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOvermind } from '../../store/overmind';
import DropDownPicker from 'react-native-dropdown-picker';

const DefaultFilter = () => {
  const { state, actions } = useOvermind();
  const { savedFilters, userData } = state.oSaved;
  const defaultFilter = state.oSaved.userData?.settings?.defaultFilter;
  // console.log(userData);

  const { setDefaultFilter } = actions.oSaved;
  const filterItems = savedFilters.map((filter) => ({
    label: filter.name,
    value: filter.id,
  }));

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
