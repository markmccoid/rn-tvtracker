import React from "react";
import { View, ScrollView, StyleSheet, Switch, Text, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOState, useOActions } from "../../store/overmind";

import SectionSavedFilters from "./SectionSavedFilters";
import SectionDefaultFilter from "./SectionDefaultFilter";
import SectionSort from "./SectionSort";

import { colors } from "../../globalStyles";
import PressableButton from "../../components/common/PressableButton";
import { SyncIcon } from "../../components/common/Icons";

const { width, height } = Dimensions.get("window");

const SettingsSortScreen = ({ navigation }) => {
  const state = useOState();
  const actions = useOActions();
  const { isDownloadStateEnabled } = state.oSaved.settings;
  const { toggleIsDownloadStateEnabled } = actions.oSaved;
  //# When savedFilters gets updated in the drag component, it isn't updated here
  //# TEST - maybe use this as the driver and send the data down OR figure out why not updating
  // React.useEffect(() => {
  //   console.log("saved filters updated", savedFilters.length);
  // }, [savedFilters.length]);
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={[styles.settingsContainer, { zIndex: 100 }]}>
        <SectionDefaultFilter />
      </View>
      <View style={styles.line} />
      <View style={styles.settingsContainer}>
        <SectionSort />
      </View>
    </View>
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
    height: 1,
    backgroundColor: colors.commonBorder,
  },
});

export default SettingsSortScreen;
