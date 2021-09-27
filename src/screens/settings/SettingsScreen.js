import React from "react";
import { SafeAreaView, View, ScrollView, StyleSheet, Text } from "react-native";
import { useOState } from "../../store/overmind";

import SectionSavedFilters from "./SectionSavedFilters";
import SectionDefaultFilter from "./SectionDefaultFilter";
import SectionSort from "./SectionSort";

import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";

const Settings = ({ navigation }) => {
  const state = useOState();
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
        <View>
          <PressableButton
            type="primary"
            onPress={() => navigation.navigate("SettingsAppDebug")}
          >
            <Text>DEBUG</Text>
          </PressableButton>
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
