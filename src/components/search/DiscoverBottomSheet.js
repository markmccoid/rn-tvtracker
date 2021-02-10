import React from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useMachine } from "@xstate/react";

import { useOState, useOActions } from "../../store/overmind";
import DiscoverInputTitle from "./DiscoverInputTitle";
import DiscoverPredefined from "./DiscoverPredefined";
import { colors } from "../../globalStyles";
import Animated from "react-native-reanimated";
import DiscoverAdvanced from "./DiscoverAdvanced";
import DiscoverADVTest from "./DiscoverADVTest";

import {
  discoverMoviesMachine,
  discoverTypesEnum,
  predefinedTypesEnum,
} from "../../statemachines/discoverMoviesMachine";

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
  const [predefined, setPredefined] = React.useState(discoverTypesEnum.POPULAR);
  const [searchString, setSearchString] = React.useState("");
  const [searchConfig, setSearchConfig] = React.useState({
    queryType: "popular",
    config: { searchString: "" },
  });
  // let { searchString } = state.oSearch;
  const { isLoading, queryType } = state.oSearch;

  //*------------------------
  //*- Search Query
  //*------------------------
  //Whenever searchConfig updates, perform search
  React.useEffect(() => {
    const { predefinedType, searchString, genres } = discoverState.context;
    console.log("USEEFFECT Context Change qt", discoverState.value, discoverState.context);
    // discoverState.value is the "queryType"  this is the "state" that the machine is currently in
    queryMovieAPIWithConfig({
      queryType: discoverState.value,
      predefinedType,
      searchString,
      genres,
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
            backgroundColor: colors.primary,
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
  const snapPoints = React.useMemo(() => ["15%", "50%", "75%"], []);

  // callbacks
  const handleSheetChanges = React.useCallback((index) => {
    // console.log("handleSheetChanges", index);
  }, []);
  const sheetFunctions = {
    expandSheet: () => bottomSheetRef.current.expand(),
    collapseSheet: () => bottomSheetRef.current.collapse(),
    snapTo: (index) => bottomSheetRef.current.snapTo(index),
  };
  const expandSheet = () => bottomSheetRef.current.expand();
  const collapseSheet = () => bottomSheetRef.current.collapse();
  const snapTo = (index) => bottomSheetRef.current.snapTo(index);
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
  const handleAdvancedConfig = React.useCallback((advancedQueryData) => {
    const { genres } = advancedQueryData;

    sendDiscoverEvent("ADVANCED_SEARCH");
    sendDiscoverEvent("UPDATE_ADV", { values: { genres } });
    // let queryConfig = { queryType: "advanced", config: { discoverCriteria } };
    // if (genres.length === 0 || !genres) {
    //   if (queryType === "title") return;
    //   queryConfig = { queryType: predefined, config: { searchString: "" } };
    //   setSearchConfig(queryConfig);
    //   return;
    // }
    // // setSearchString("");
    // setSearchConfig(queryConfig);
  }, []);
  return (
    <BottomSheet
      backgroundComponent={CustomBackground}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      animateOnMount
    >
      <View style={{}}>
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
        <DiscoverAdvanced handleAdvancedConfig={handleAdvancedConfig} />
        <DiscoverADVTest handleAdvancedConfig={handleAdvancedConfig} />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
});
export default DiscoverBottomSheet;
