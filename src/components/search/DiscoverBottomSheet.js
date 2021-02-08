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
    const { queryType, predefinedType, searchString, genres } = discoverState.context;
    console.log("useeffect", queryType, predefinedType);
    queryMovieAPIWithConfig({ queryType, predefinedType, searchString, genres });
  }, [discoverState.context]);

  // console.log("every rerender", discoverState.context);

  // Whenever searchString updates, prepare config, if empty send queryType popular
  // React.useEffect(() => {
  //   const queryConfig = { queryType: "title", config: { searchString } };
  //   if (searchString.trim().length === 0 || !searchString) {
  //     queryConfig.queryType = predefined;
  //   }
  //   setSearchConfig(queryConfig);
  // }, [searchString]);

  React.useEffect(() => {
    const queryConfig = { queryType: predefined, config: { searchString } };
    setSearchString("");
    setSearchConfig(queryConfig);
  }, [predefined]);
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
  const snapPoints = React.useMemo(() => ["12%", "50%", "75%"], []);

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
  const handleSearchString = (value) => {
    sendDiscoverEvent("TITLE_SEARCH");
    sendDiscoverEvent({ type: "UPDATE_TITLE", value });

    // const queryConfig = { queryType: "title", config: { searchString } };
    // if (searchString.trim().length === 0 || !searchString) {
    //   queryConfig.queryType = predefined;
    // }
    // setSearchString(searchString);
    // setSearchConfig(queryConfig);
  };

  const handlePredefined = (predefinedType) => {
    console.log("send predefined", predefinedType);
    sendDiscoverEvent({ type: "PREDEFINED_SEARCH" });
    sendDiscoverEvent({ type: "UPDATE_PREDEFINED", predefinedType });

    // const queryConfig = { queryType, config: { searchString: "" } };
    // setSearchString("");
    // setSearchConfig(queryConfig);
  };

  // { genres: [], yearReleasedStart: number, yearReleasedEnd: number  }
  const handleAdvancedConfig = (advancedQueryData) => {
    const { genres } = advancedQueryData;
    const discoverCriteria = { genres };
    let queryConfig = { queryType: "advanced", config: { discoverCriteria } };
    if (genres.length === 0 || !genres) {
      if (queryType === "title") return;
      queryConfig = { queryType: predefined, config: { searchString: "" } };
      setSearchConfig(queryConfig);
      return;
    }
    // setSearchString("");
    setSearchConfig(queryConfig);
  };
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
          queryType={queryType}
          predefinedType={discoverState.context.predefinedType}
          setPredefined={handlePredefined}
        />
        <DiscoverAdvanced handleAdvancedConfig={handleAdvancedConfig} />
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
