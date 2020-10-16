import React from "react";
import { View, StyleSheet } from "react-native";
import { useOState } from "../../store/overmind";
import { useNavigation } from "@react-navigation/native";
import { Button } from "../common/Buttons";

import SavedFiltersItem from "./SavedFiltersItem";

const SavedFiltersView = () => {
  const state = useOState();
  const { savedFilters } = state.oSaved;
  const navigation = useNavigation();
  return (
    <View>
      <View style={styles.settingsSection}>
        {savedFilters.map((savedFilter) => {
          return (
            <View
              key={savedFilter.id}
              style={{ borderBottomColor: "#ccc", borderBottomWidth: 1 }}
            >
              <SavedFiltersItem savedFilter={savedFilter} />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Button
          title="Create"
          wrapperStyle={{ width: 100 }}
          onPress={() => navigation.navigate("CreateSavedFilter")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsSection: {
    marginVertical: 10,
    paddingHorizontal: 0,

    paddingVertical: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
});
export default SavedFiltersView;
