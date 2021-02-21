import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMachine } from "@xstate/react";
import { View as MotiView, AnimatePresence } from "moti";
import { useHeaderHeight } from "@react-navigation/stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated from "react-native-reanimated";

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

  // const height = useWindowDimensions().height;
  // const tabHeight = useBottomTabBarHeight();
  // const headerHeight = useHeaderHeight();
  // // Don't think I need working height.
  // // Seems like bottomSheet is relative to the bottom tab and header
  // const workingHeight = height - tabHeight - headerHeight;

  //*------------------------
  //* Bottomsheet Background
  const CustomBackground = ({ animatedIndex, style }) => {
    return (
      <Animated.View
        style={[
          style,
          {
            backgroundColor: "#eee",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#777",
          },
        ]}
      />
    );
  };
  //*--- SHEET FUNCS And VARS ---------------------
  const bottomSheetRef = React.useRef(null);

  // variables
  const snapObj = {
    hidden: 15,
    simpleSearch: 150,
    keyboard: 380,
    max: "90%",
  };

  // return an object we can use to call the snapTo function with
  // snapTo(snapEnum.keyboard)
  const snapEnum = Object.keys(snapObj).reduce(
    (final, key, idx) => ({ ...final, [key]: idx }),
    {}
  );
  // const snapPoints = React.useMemo(() => ["12%", "20%", "60%", "75%", "100%"], []);
  const snapPoints = React.useMemo(
    () => [snapObj.hidden, snapObj.simpleSearch, snapObj.keyboard, snapObj.max],
    []
  );

  // callbacks
  const handleSheetChanges = React.useCallback((index) => {
    // making currentSnapPointInfo an object, so we can pass other information if needed
    setCurrentSnapPointInfo({ currSnapIndex: index });
  }, []);

  const expandSheet = () => bottomSheetRef.current.expand();
  const collapseSheet = () => bottomSheetRef.current.collapse();
  const snapTo = (index) => bottomSheetRef.current.snapTo(index);

  const sheetFunctions = {
    expandSheet,
    collapseSheet,
    snapTo,
    snapEnum,
  };
  //*---END SHEET FUNCS And VARS ---------------------

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

      <Button
        title={`Activate ${discoverState.matches("advanced") ? "Simple" : "Advanced"}`}
        onPress={() => {
          if (discoverState.matches("advanced")) {
            sendDiscoverEvent("SIMPLE_SEARCH");
            snapTo(snapEnum.simpleSearch);
          } else {
            sendDiscoverEvent("ADVANCED_SEARCH");
            snapTo(snapEnum.keyboard);
          }
        }}
      />
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
