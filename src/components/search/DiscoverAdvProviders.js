import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import { watchProviders } from "../../storage/externalData";
import DropDownPicker from "react-native-dropdown-picker";
import { useAdvancedSearchState } from "../../context/AdvancedSearchContext";
import { colors } from "../../globalStyles";
import { EraserIcon } from "../../components/common/Icons";

const createProvidersArray = () => [
  { label: "All Providers", value: "all" },
  ...watchProviders.map((wp) => ({ label: wp.providerName, value: wp.providerId.toString() })),
];

const clearItem = (items) => {
  return items.map((el) => ({ label: el.label, value: el.value, selected: false }));
};
const DiscoverAdvProviders = ({ pickerStateInfo }) => {
  const providersArray = React.useMemo(createProvidersArray, []);
  const [selectedItem, setSelectedItem] = React.useState([]);
  const { width } = useDimensions().window;
  // Pull out picker states info
  const { pickerStates, updatePickerStates, pickerKey } = pickerStateInfo;

  const {
    currentSnapPointInfo: { currSnapIndex },
    advancedSearchHandlers: { handleAdvWatchProviders },
  } = useAdvancedSearchState();

  let controller;
  const resetAndClose = () => {
    controller.reset();
    controller.close();
  };
  //-- Resets dropdown when "all" is selected
  // AND then
  React.useEffect(() => {
    if (selectedItem.includes("all")) {
      setSelectedItem([]);
      resetAndClose();
    } else if (selectedItem) {
      handleAdvWatchProviders(selectedItem);
    }
  }, [selectedItem]);

  const dropDownHeight = currSnapIndex === 3 ? 300 : 150;

  return (
    <View style={styles.container}>
      <DropDownPicker
        items={providersArray}
        isVisible={pickerStates.isProvidersOpen}
        onOpen={() => updatePickerStates(pickerKey, true)}
        onClose={() => updatePickerStates(pickerKey, false)}
        controller={(instance) => (controller = instance)}
        placeholder="All Providers"
        containerStyle={{
          height: 40,
          width: width / 2.5,
          borderWidth: 1,
          borderColor: colors.listBorder,
        }}
        dropDownMaxHeight={dropDownHeight}
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
      <Pressable
        onPress={resetAndClose}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#ccc" : colors.backgroundColor,
            padding: 5,
            borderRadius: 10,
            marginLeft: 10,
            transform: [{ translateY: pressed ? 2 : 0 }, { translateX: pressed ? 2 : 0 }],
          },
        ]}
      >
        <EraserIcon size={25} style={{}} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DiscoverAdvProviders;
