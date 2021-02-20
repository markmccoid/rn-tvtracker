import React from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Picker } from "react-native";
import { View as MotiView, AnimatePresence } from "moti";
import DropDownPicker from "react-native-dropdown-picker";
import { useDimensions } from "@react-native-community/hooks";
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
  const yearsObject = React.useMemo(() => {
    return yearsArray.reduce((obj, year) => {
      if (year === "All Years") {
        return { ...obj, [year]: 0 };
      }
      return { ...obj, [year]: parseInt(year) };
    }, {});
  }, []);
  const yearsDDPicker = React.useMemo(() => {
    return yearsArray.map((year) => {
      if (year === "All Years") {
        return { label: year, value: 0 };
      }
      return { label: year, value: parseInt(year) };
    });
  }, []);

  const [selectedItem, setSelectedItem] = React.useState();
  const [showPicker, setShowPicker] = React.useState(false);
  const toggleShowPicker = () => setShowPicker((prev) => !prev);

  const {
    currentSnapPointInfo: { currSnapIndex },
    advancedSearchHandlers: { handleAdvReleaseYear },
  } = useAdvancedSearchState();

  const { width } = useDimensions().window;
  // Pull out picker states info
  const { pickerStates, updatePickerStates, pickerKey } = pickerStateInfo;

  React.useEffect(() => {
    if (yearsObject) {
      // if selectedItem = 0, then the query won't rerun IF other advancedSearch options have not been selected.
      handleAdvReleaseYear(selectedItem);
    }
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
      {/* <Pressable onPress={toggleShowPicker}>
        <Text
          style={{
            backgroundColor: "white",
            width: 100,
            textAlign: "center",
            padding: 5,
            height: 30,
            borderColor: "gray",
            borderWidth: 1,
          }}
        >
          {yearsArray[selectedItem]}
        </Text>
      </Pressable>
      <AnimatePresence>
        {showPicker && (
          <MotiView
            style={{
              width: 100,
              borderColor: "gray",
              borderWidth: 1,
              borderRadius: 15,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              backgroundColor: "white",
            }}
            from={{ height: 0, opacity: 0 }}
            animate={{ height: 200, opacity: 1 }}
            transition={{
              // default settings for all style values
              type: "timing",
              duration: 450,
              delay: 50,
              // set a custom transition for scale
              height: {
                type: "timing",
                duration: 350,
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >
            <Pressable onPress={toggleShowPicker}>
              <Picker
                selectedValue={selectedItem}
                itemStyle={{ color: "black", fontSize: 14 }}
                onValueChange={(index) => {
                  setSelectedItem(index);
                }}
              >
                {yearsArray.map((value, i) => (
                  <Picker.Item label={value} value={i} key={i} />
                ))}
              </Picker>
            </Pressable>
          </MotiView>
        )}
      </AnimatePresence> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
  },
});

export default DiscoverAdvYears;
