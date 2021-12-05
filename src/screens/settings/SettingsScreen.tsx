import React from "react";
import { View, ScrollView, StyleSheet, Switch, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOState, useOActions } from "../../store/overmind";

import SectionSavedFilters from "./SectionSavedFilters";
import SectionDefaultFilter from "./SectionDefaultFilter";
import SectionSort from "./SectionSort";

import { colors } from "../../globalStyles";
import { TouchableOpacity } from "../../components/common/Pressables";
import {
  AscAlphaIcon,
  CaretRightIcon,
  FilterIcon,
  FlagIcon,
  InfoIcon,
  SyncIcon,
} from "../../components/common/Icons";

const { width, height } = Dimensions.get("window");

const Settings = ({ navigation }) => {
  const state = useOState();
  const actions = useOActions();
  const { isDownloadStateEnabled, showNextAirDateEnabled } = state.oSaved.settings;
  const { toggleIsDownloadStateEnabled, toggleShowNextAirDateEnabled } = actions.oSaved;
  //# When savedFilters gets updated in the drag component, it isn't updated here
  //# TEST - maybe use this as the driver and send the data down OR figure out why not updating
  // React.useEffect(() => {
  //   console.log("saved filters updated", savedFilters.length);
  // }, [savedFilters.length]);
  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.line} />

      <View style={styles.settingsMenuItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsSavedFiltersStack")}
          style={styles.menuPressable}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FilterIcon size={20} />
            <Text style={styles.settingsText}>Saved Filters</Text>
            {/* <InfoIcon size={20} /> */}
          </View>
          <CaretRightIcon size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <View style={styles.settingsMenuItem}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsMainSortStack")}
          style={styles.menuPressable}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AscAlphaIcon size={20} />
            <Text style={styles.settingsText}>Show Sort Order</Text>
            {/* <InfoIcon size={20} /> */}
          </View>
          <CaretRightIcon size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <View style={[styles.settingsMenuItem, { backgroundColor: "white" }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SettingsAppBackup")}
          activeOpacity={0.7}
          style={styles.menuPressable}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <SyncIcon size={20} />
            <Text style={styles.settingsText}>Data Backup/Restore</Text>
            {/* <InfoIcon size={20} /> */}
          </View>
          <CaretRightIcon size={25} />
        </TouchableOpacity>
      </View>

      <View style={styles.line} />

      <View style={[styles.settingsMenuItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FlagIcon size={20} />
          <Text style={styles.settingsText}>Enable Secondary Watched Option</Text>

          {/* <InfoIcon size={20} /> */}
        </View>
        <Switch
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleIsDownloadStateEnabled}
          value={isDownloadStateEnabled}
        />
      </View>

      <View style={styles.line} />

      <View style={[styles.settingsMenuItem]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FlagIcon size={20} />
          <Text style={styles.settingsText}>Show Status/Next Air on Main Screen</Text>

          {/* <InfoIcon size={20} /> */}
        </View>
        <Switch
          style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleShowNextAirDateEnabled}
          value={showNextAirDateEnabled}
        />
      </View>

      <View style={styles.line} />

      <View style={{ paddingBottom: 50 }}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // paddingHorizontal: 10,
    backgroundColor: colors.background,
    //width: width - 20,
  },
  settingsMenuItem: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  rightArrowPressable: { flex: 1, alignItems: "flex-end" },
  menuPressable: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsText: {
    fontSize: 14,
    paddingLeft: 5,
    paddingRight: 10,
  },
  line: {
    height: 1,
    backgroundColor: colors.commonBorder,
  },
});

export default Settings;
