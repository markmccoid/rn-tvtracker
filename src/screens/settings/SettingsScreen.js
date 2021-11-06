import React from "react";
import { View, ScrollView, StyleSheet, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOState } from "../../store/overmind";

import SectionSavedFilters from "./SectionSavedFilters";
import SectionDefaultFilter from "./SectionDefaultFilter";
import SectionSort from "./SectionSort";

import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";
import { SyncIcon } from "../../components/common/Icons";

const { width, height } = Dimensions.get("window");

const Settings = ({ navigation }) => {
  const state = useOState();
  //# When savedFilters gets updated in the drag component, it isn't updated here
  //# TEST - maybe use this as the driver and send the data down OR figure out why not updating
  // React.useEffect(() => {
  //   console.log("saved filters updated", savedFilters.length);
  // }, [savedFilters.length]);
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.settingsContainer}>
        <SectionSavedFilters />
      </View>
      <View style={[styles.settingsContainer, { zIndex: 100 }]}>
        <SectionDefaultFilter />
      </View>
      <View style={styles.line} />
      <View style={styles.settingsContainer}>
        <SectionSort />
      </View>
      <View style={styles.line} />
      <View style={styles.settingsMenuItem}>
        <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
          <PressableButton
            style={styles.settingsButton}
            onPress={() => navigation.navigate("SettingsAppBackup")}
          >
            <Text style={{ marginRight: 8 }}>Backup Data</Text>
            <SyncIcon size={20} />
          </PressableButton>
        </View>
      </View>
      <View style={styles.line} />
      <View style={[styles.settingsMenuItem, { paddingBottom: 50 }]}>
        {/* <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
          <PressableButton
            style={styles.settingsButton}
            onPress={() => navigation.navigate("SettingsAppDebug")}
          >
            <Text>DEBUG</Text>
          </PressableButton>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    //width: width - 20,
  },
  settingsContainer: {
    margin: 5,
    marginTop: 15,
  },
  settingsMenuItem: {
    margin: 5,
  },
  settingsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  settingsButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderColor: colors.buttonPrimaryBorder,
    borderRadius: 5,
    backgroundColor: "white",
  },
  line: {
    height: 2,
    backgroundColor: colors.commonBorder,
  },
});

export default Settings;
