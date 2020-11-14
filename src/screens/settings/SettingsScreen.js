import React from "react";
import { SafeAreaView, View, Text, ScrollView, StyleSheet } from "react-native";
import { useOState } from "../../store/overmind";
import SavedFiltersView from "../../components/settings/SavedFiltersView";

import DefaultFilter from "./DefaultFilter";
import DefaultSort from "./DefaultSort";

const Settings = ({ navigation }) => {
  const state = useOState();
  const { savedFilters } = state.oSaved;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsText}>Saved Filters</Text>
          <SavedFiltersView />
        </View>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsText}>Set Default Filter</Text>
          <Text>Choose a saved filter to be run when app starts.</Text>
          <DefaultFilter />
        </View>
        <View style={styles.settingsContainer}>
          <Text style={styles.settingsText}>Set Default Sort</Text>
          <Text>Choose a default sort order for viewing movies.</Text>
          <DefaultSort />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
  },
  settingsContainer: {
    margin: 5,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Settings;
