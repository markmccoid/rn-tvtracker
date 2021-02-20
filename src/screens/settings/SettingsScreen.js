import React from "react";
import { SafeAreaView, View, ScrollView, StyleSheet } from "react-native";
import { useOState } from "../../store/overmind";

import SectionSavedFilters from "./SectionSavedFilters";
import SectionDefaultFilter from "./SectionDefaultFilter";
import SectionSort from "./SectionSort";

import { colors } from "../../globalStyles";

const Settings = ({ navigation }) => {
  //# When savedFilters gets updated in the drag component, it isn't updated here
  //# TEST - maybe use this as the driver and send the data down OR figure out why not updating
  // React.useEffect(() => {
  //   console.log("saved filters updated", savedFilters.length);
  // }, [savedFilters.length]);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.settingsContainer}>
          <SectionSavedFilters />
        </View>
        <View style={[styles.settingsContainer, { zIndex: 100 }]}>
          <SectionDefaultFilter />
        </View>
        <View style={styles.settingsContainer}>
          <SectionSort />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    marginHorizontal: 10,
  },
  settingsContainer: {
    margin: 5,
    marginTop: 15,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Settings;
