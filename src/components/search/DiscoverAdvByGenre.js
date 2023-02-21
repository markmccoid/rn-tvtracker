import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { colors } from "../../globalStyles";
import { EraserIcon } from "../../components/common/Icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useAdvancedSearchState } from "../../context/AdvancedSearchContext";

const DiscoverByGenre = ({ allGenreFilters, pickerStateInfo }) => {
  const [selectedItem, setSelectedItem] = React.useState([]);
  const genres = [
    { label: "Any Genre", value: "any" },
    ...allGenreFilters.map((genreObj) => ({
      label: genreObj.name,
      value: genreObj.id,
    })),
  ];
  // Pull out picker states info
  const { pickerStates, updatePickerStates, pickerKey } = pickerStateInfo;
  const {
    currentSnapPointInfo: { currSnapIndex },
    advancedSearchHandlers: { handleAdvGenres },
  } = useAdvancedSearchState();

  let controller;
  const resetAndClose = () => {
    controller.reset();
    controller.close();
  };
  React.useEffect(() => {
    if (selectedItem.includes("any")) {
      resetAndClose();
    }
    if (selectedItem) {
      handleAdvGenres(selectedItem);
    }
  }, [selectedItem]);

  React.useEffect(() => {
    if (currSnapIndex <= 1) {
      controller.close();
    }
  }, [currSnapIndex]);

  const dropDownHeight = currSnapIndex === 3 ? 400 : 230;
  return (
    <View style={styles.container}>
      <View
        style={{
          width: 225,
        }}
      >
        <DropDownPicker
          items={genres}
          isVisible={pickerStates.isGenreOpen}
          onOpen={() => updatePickerStates(pickerKey, true)}
          onClose={() => updatePickerStates(pickerKey, false)}
          controller={(instance) => (controller = instance)}
          placeholder="Any Genre"
          dropDownMaxHeight={dropDownHeight}
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
        />
      </View>

      <Pressable
        onPress={resetAndClose}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "#ccc" : colors.backgroundColor,
            padding: 5,
            borderRadius: 10,
            marginLeft: 10,
            transform: [
              { translateY: pressed ? 2 : 0 },
              { translateX: pressed ? 2 : 0 },
            ],
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

export default DiscoverByGenre;
