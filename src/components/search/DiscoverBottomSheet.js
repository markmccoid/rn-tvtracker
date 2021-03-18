import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMachine } from "@xstate/react";
import { View as MotiView, AnimatePresence } from "moti";
import { useHeaderHeight } from "@react-navigation/stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated from "react-native-reanimated";

import { snapPoints, snapEnum, CustomBackground } from "./BottomSheetUtils";

import { Button } from "../../components/common/Buttons";
import DiscoverInputTitle from "./DiscoverInputTitle";
import DiscoverPredefined from "./DiscoverPredefined";
import { colors } from "../../globalStyles";
import DiscoverAdvanced from "./DiscoverAdvanced";
import SnapPointProvider from "../../context/AdvancedSearchContext";

import { discoverMoviesMachine } from "../../statemachines/discoverMoviesMachine";

const DiscoverBottomSheet = ({ navigation }) => {
  const [discoverState, sendDiscoverEvent] = useMachine(discoverMoviesMachine);
  const [currentSnapPointInfo, setCurrentSnapPointInfo] = React.useState(1);
  const bottomSheetRef = React.useRef(null);

  // Functions
  // const expandSheet = () => bottomSheetRef.current.expand();
  // const collapseSheet = () => bottomSheetRef.current.collapse();
  // const snapTo = (index) => bottomSheetRef.current.snapTo(index);

  const sheetFunctions = {
    expandSheet: () => bottomSheetRef.current.expand(),
    collapseSheet: () => bottomSheetRef.current.collapse(),
    snapTo: (index) => bottomSheetRef.current.snapTo(index),
    snapEnum,
  };

  // callbacks
  const handleSheetChanges = React.useCallback((index) => {
    // making currentSnapPointInfo an object, so we can pass other information if needed
    setCurrentSnapPointInfo({ currSnapIndex: index });
  }, []);
  //*-------------------------
  //* Handler Functions
  //*-------------------------
  const handleSearchString = (value) => {
    sendDiscoverEvent({ type: "UPDATE_TITLE", value });
  };

  const handlePredefined = (predefinedType) => {
    sendDiscoverEvent({ type: "UPDATE_PREDEFINED", predefinedType });
  };

  const advancedSearchHandlers = {
    handleAdvGenres: (genres) => {
      sendDiscoverEvent({ type: "UPDATE_GENRES", genres });
    },
    handleAdvReleaseYear: (releaseYear) => {
      sendDiscoverEvent({ type: "UPDATE_RELEASEYEAR", releaseYear });
    },
    handleAdvWatchProviders: (watchProviders) => {
      sendDiscoverEvent({ type: "UPDATE_WATCHPROVIDERS", watchProviders });
    },
  };

  return (
    <BottomSheet
      backgroundComponent={CustomBackground}
      ref={bottomSheetRef}
      index={snapEnum.simpleSearch}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      topInset={25} // Keeps it from covering all of back screen
      animateOnMount
    >
      <AnimatePresence>
        {discoverState.matches("simple") && (
          <MotiView
            from={{ height: 0, opacity: 0 }}
            animate={{ height: 100, opacity: 1 }}
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
            <DiscoverInputTitle
              setSearchString={handleSearchString}
              searchString={discoverState.context.searchString}
              sheetFunctions={sheetFunctions}
            />
            <DiscoverPredefined
              isPredefinedState={discoverState.toStrings().includes("simple.predefined")}
              predefinedType={discoverState.context.predefinedType}
              setPredefined={handlePredefined}
            />
          </MotiView>
        )}
      </AnimatePresence>

      <View style={{ marginHorizontal: 25 }}>
        <Button
          title={`Activate ${
            discoverState.matches("advanced") ? "Simple" : "Advanced"
          } Search`}
          onPress={() => {
            if (discoverState.matches("advanced")) {
              sendDiscoverEvent("SIMPLE_SEARCH");
              sheetFunctions.snapTo(snapEnum.simpleSearch);
            } else {
              sendDiscoverEvent("ADVANCED_SEARCH");
              sheetFunctions.snapTo(snapEnum.keyboard);
            }
          }}
        />
      </View>
      <BottomSheetScrollView style={styles.searchContainer}>
        <View>
          <AnimatePresence>
            {discoverState.value === "advanced" && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: 1000, opacity: 1 }}
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
                <SnapPointProvider
                  advancedSearchObject={{ currentSnapPointInfo, advancedSearchHandlers }}
                >
                  <DiscoverAdvanced />
                </SnapPointProvider>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  searchContainer: {},
  bottomContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
export default DiscoverBottomSheet;
