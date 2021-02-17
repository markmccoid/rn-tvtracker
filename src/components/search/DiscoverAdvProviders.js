import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

import { watchProviders } from "../../storage/externalData";
import DropDownPicker from "react-native-dropdown-picker";

import { colors } from "../../globalStyles";

const createProvidersArray = () => [
  { label: "All Providers", value: "all" },
  ...watchProviders.map((wp) => ({ label: wp.providerName, value: wp.providerId })),
];

const clearItem = (items) => {
  return items.map((el) => ({ label: el.label, value: el.value, selected: false }));
};
const DiscoverAdvProviders = ({ handleAdvWatchProviders }) => {
  const providersArray = React.useMemo(createProvidersArray, []);
  const [selectedItem, setSelectedItem] = React.useState([]);
  let controller;

  React.useEffect(() => {
    if (selectedItem.includes("all")) {
      controller.reset();
      controller.close();
    }
    if (selectedItem) {
      handleAdvWatchProviders(selectedItem);
    }
  }, [selectedItem]);

  return (
    <View style={styles.container}>
      <Text>Providers</Text>
      <DropDownPicker
        items={providersArray}
        controller={(instance) => (controller = instance)}
        placeholder="All Providers"
        containerStyle={{
          height: 40,
          borderWidth: 1,
          borderColor: colors.listBorder,
        }}
        defaultValue={selectedItem}
        dropDownStyle={{
          backgroundColor: colors.listItemBackground,
          borderWidth: 1,
          borderColor: colors.listBorder,
        }}
        multiple={true}
        multipleText="%d items have been selected."
        min={0}
        max={10}
        activeLabelStyle={{ color: colors.includeGreen, fontWeight: "bold" }}
        onChangeItem={(items) => {
          setSelectedItem(items);
        }}
        // onChangeList={(items, callback) => {
        //   setSelectedItem(items);
        //   setTimeout(() => callback(), [1000]);
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    marginHorizontal: 10,
  },
});

export default DiscoverAdvProviders;
