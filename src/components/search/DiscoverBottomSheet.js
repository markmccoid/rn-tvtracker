import React from "react";
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View as MotiView, AnimatePresence } from "moti";
import { useMachine } from "@xstate/react";

import { useOState, useOActions } from "../../store/overmind";
import { Button } from "../../components/common/Buttons";
import DiscoverInputTitle from "./DiscoverInputTitle";
import DiscoverPredefined from "./DiscoverPredefined";
import { colors } from "../../globalStyles";
import Animated from "react-native-reanimated";
import DiscoverAdvanced from "./DiscoverAdvanced";

import { discoverMoviesMachine } from "../../statemachines/discoverMoviesMachine";

const predefinedQueries = [
  { name: "popular", label: "Popular Movies", isActive: false },
  { name: "nowplaying", label: "Now Playing", isActive: false },
  { name: "upcoming", label: "Upcoming", isActive: false },
];

const DiscoverBottomSheet = ({ navigation }) => {
  const [discoverState, sendDiscoverEvent] = useMachine(discoverMoviesMachine);
  const state = useOState();
  const actions = useOActions();
  const { queryMovieAPIWithConfig } = actions.oSearch;

  const height = useWindowDimensions().height;
  // const [predefined, setPredefined] = React.useState(discoverTypesEnum.POPULAR);
  // const [searchString, setSearchString] = React.useState("");
  // const [searchConfig, setSearchConfig] = React.useState({
  //   queryType: "popular",
  //   config: { searchString: "" },
  // });
  // let { searchString } = state.oSearch;
  // const { isLoading, queryType } = state.oSearch;

  //*------------------------
  //*- Search Query
  //*------------------------
  //Whenever searchConfig updates, perform search
  React.useEffect(() => {
    const {
      predefinedType,
      searchString,
      genres,
      releaseYear,
      watchProviders,
    } = discoverState.context;
    // console.log(
    //   "USEEFFECT Context Change qt",
    //   discoverState.value,
    //   predefinedType,
    //   searchString,
    //   genres,
    //   releaseYear,
    //   watchProviders
    // );
    // discoverState.value is the "queryType"  this is the "state" that the machine is currently in
    queryMovieAPIWithConfig({
      queryType: discoverState.value,
      predefinedType,
      searchString,
      genres,
      releaseYear,
      watchProviders,
    });
  }, [discoverState.context]);

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
  // ref
  const bottomSheetRef = React.useRef(null);

  // variables
  const snapObj = {
    hidden: "1%",
    simpleSearch: height * 0.16,
    keyboard: height * 0.5,
    max: "80%",
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
    // console.log("handleSheetChanges", index);
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

  //*------------------------

  //*-------------------------
  //* Handler Functions
  //*-------------------------
  const handleSearchString = (value) => {
    sendDiscoverEvent("TITLE_SEARCH");
    sendDiscoverEvent({ type: "UPDATE_TITLE", value });
  };

  const handlePredefined = (predefinedType) => {
    sendDiscoverEvent({ type: "PREDEFINED_SEARCH" });
    sendDiscoverEvent({ type: "UPDATE_PREDEFINED", predefinedType });
  };

  // { genres: [], yearReleasedStart: number, yearReleasedEnd: number  }
  const handleAdvGenres = {
    addGenre: (genreId) => {
      sendDiscoverEvent({ type: "ADD_GENRE", genreId });
    },
    removeGenre: (genreId) => {
      sendDiscoverEvent({ type: "REMOVE_GENRE", genreId });
    },
    clearGenres: (genreId) => {
      sendDiscoverEvent({ type: "CLEAR_GENRES", genreId });
    },
  };
  const handleAdvReleaseYear = (releaseYear) => {
    sendDiscoverEvent({ type: "UPDATE_RELEASEYEAR", releaseYear });
  };
  const handleAdvWatchProviders = (watchProviders) => {
    sendDiscoverEvent({ type: "UPDATE_WATCHPROVIDERS", watchProviders });
  };

  return (
    <BottomSheet
      backgroundComponent={CustomBackground}
      ref={bottomSheetRef}
      index={snapEnum.simpleSearch}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      topInset={25}
      animateOnMount
    >
      <AnimatePresence>
        {discoverState.value !== "advanced" && (
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
              queryType={discoverState.value}
              predefinedType={discoverState.context.predefinedType}
              setPredefined={handlePredefined}
            />
          </MotiView>
        )}
      </AnimatePresence>

      <Button
        title={`Activate ${discoverState.value === "advanced" ? "Simple" : "Advanced"}`}
        onPress={() => {
          if (discoverState.value === "advanced") {
            sendDiscoverEvent("PREDEFINED_SEARCH");
            console.log("BEFORE", snapEnum.simpleSearch);
            snapTo(snapEnum.simpleSearch);
          } else {
            sendDiscoverEvent("ADVANCED_SEARCH");
            snapTo(snapEnum.max);
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
                <DiscoverAdvanced
                  selectedGenres={discoverState.context.genres}
                  handleAdvGenres={handleAdvGenres}
                  handleAdvReleaseYear={handleAdvReleaseYear}
                  handleAdvWatchProviders={handleAdvWatchProviders}
                />
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
