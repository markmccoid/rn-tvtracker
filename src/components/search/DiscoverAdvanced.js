import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Divider } from "react-native-elements";
import { useOState } from "../../store/overmind";
import DiscoverAdvByGenre from "./DiscoverAdvByGenre";
import DiscoverAdvYears from "./DiscoverAdvYears";
import DiscoverAdvProviders from "./DiscoverAdvProviders";

const defaultPickerStates = {
  isGenreOpen: false,
  isReleaseDateOpen: false,
  isProvidersOpen: false,
};

const DiscoverAdvanced = () => {
  const [pickerStates, setPickerStates] = React.useState(defaultPickerStates);
  const state = useOState();
  const { allGenres } = state.oSearch; // [{ id, name }]

  const updatePickerStates = (pickerKey, isOpen) => {
    // update whatever picker is calling this to passed state,
    // ALL other pickers set to false (closed)
    // NOTE: this also causes all pickers to close when I manually (controller.close())
    // the genre picker in response to being at a snapPointIndex <=1
    setPickerStates({ ...defaultPickerStates, [pickerKey]: isOpen });
  };

  return (
    <Pressable onPress={() => setPickerStates(defaultPickerStates)} style={styles.container}>
      <Divider style={{ backgroundColor: "black", marginTop: 10 }} />
      <View style={styles.sectionContainer}>
        <Text>Genres</Text>
        <DiscoverAdvByGenre
          allGenreFilters={allGenres}
          pickerStateInfo={{ pickerStates, updatePickerStates, pickerKey: "isGenreOpen" }}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.sectionContainer}>
          <Text>Release Date</Text>
          <DiscoverAdvYears
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: "isReleaseDateOpen",
            }}
          />
        </View>
        <View style={[styles.sectionContainer]}>
          <Text>Providers</Text>
          <DiscoverAdvProviders
            pickerStateInfo={{
              pickerStates,
              updatePickerStates,
              pickerKey: "isProvidersOpen",
            }}
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 10,
    flex: 1,
  },
  sectionContainer: {
    flexDirection: "column",
    margin: 10,
    zIndex: 1000,
  },
  title: {
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default React.memo(DiscoverAdvanced);
