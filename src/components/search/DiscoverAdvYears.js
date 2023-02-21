import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Picker,
  useWindowDimensions,
} from "react-native";
import { View as MotiView, AnimatePresence } from "moti";
import DropDownPicker from "react-native-dropdown-picker";

import { useAdvancedSearchState } from "../../context/AdvancedSearchContext";
import { colors } from "../../globalStyles";

const createYearsArray = () => {
  const startYear = new Date().getFullYear() + 1;
  const endYear = 1900;
  let yearsArray = [];
  yearsArray.push("All Years");
  for (let i = startYear; i >= endYear; i--) {
    yearsArray.push(i.toString());
  }

  return yearsArray;
};

const DiscoverAdvYears = ({ pickerStateInfo }) => {
  const yearsArray = React.useMemo(() => createYearsArray(), []);
  const yearsDDPicker = React.useMemo(() => {
    return yearsArray.map((year) => {
      if (year === "All Years") {
        return { label: year, value: 0 };
      }
      return { label: year, value: parseInt(year) };
    });
  }, []);

  const [selectedItem, setSelectedItem] = React.useState();

  const {
    currentSnapPointInfo: { currSnapIndex },
    advancedSearchHandlers: { handleAdvReleaseYear },
  } = useAdvancedSearchState();

  const { width } = useWindowDimensions();
  // Pull out picker states info
  const { pickerStates, updatePickerStates, pickerKey } = pickerStateInfo;

  React.useEffect(() => {
    // if selectedItem = 0, then the query won't rerun IF other advancedSearch options have not been selected.
    handleAdvReleaseYear(selectedItem);
  }, [selectedItem]);

  const dropDownHeight = currSnapIndex === 3 ? 300 : 150;
  return (
    <View style={{ width: width / 4 }}>
      <DropDownPicker
        isVisible={pickerStates.isReleaseDateOpen}
        onOpen={() => updatePickerStates(pickerKey, true)}
        onClose={() => updatePickerStates(pickerKey, false)}
        items={yearsDDPicker}
        defaultValue={selectedItem}
        placeholder="All Years"
        dropDownMaxHeight={dropDownHeight}
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

export default DiscoverAdvYears;
