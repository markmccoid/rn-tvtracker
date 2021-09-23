import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Divider } from "react-native-elements";
import { useOState, useOActions } from "../../../store/overmind";
import _ from "lodash";

import { colors, styleHelpers } from "../../../globalStyles";
import { Button } from "../../../components/common/Buttons";
import FilterByTagsContainer from "../../../components/Filter/FilterByTagsContainer";
import FilterByGenreContainer from "../../../components/Filter/FilterByGenreContainer";
import PressableButton from "../../../components/common/PressableButton";

const ViewTVShowsFilterScreen = ({ route, navigation }) => {
  const state = useOState();
  const actions = useOActions();
  const { getAllFilterTags, getAllFilterGenres } = state.oSaved;
  // const { genres } = state.oSaved.generated;
  const { tagOperator, excludeTagOperator, genreOperator } = state.oSaved.filterData;
  const {
    addTagToFilter,
    removeTagFromFilter,
    addExcludeTagToFilter,
    removeExcludeTagFromFilter,
    clearFilterScreen,
    setTagOperator,
    setExcludeTagOperator,
    addGenreToFilter,
    removeGenreFromFilter,
    setGenreOperator,
    clearFilterTags,
    clearFilterGenres,
  } = actions.oSaved;

  //------------------------------

  const titleSize = "l";

  return (
    <ScrollView bounces={false} style={styles.scrollContainer}>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
            padding: 10,
            borderBottomColor: colors.commonBorder,
            ...styleHelpers.buttonShadow,
            backgroundColor: "#9BAAA0",
          }}
        >
          <PressableButton
            onPress={() => clearFilterScreen()}
            type="primary"
            style={{ backgroundColor: "white", paddingVertical: 10 }}
          >
            <Text style={{ color: colors.mutedRed, fontWeight: "600" }}>Clear Filters</Text>
          </PressableButton>
          <PressableButton
            onPress={() => {
              navigation.navigate("TVShowsScreen", { filterModified: true });
              // navigation.goBack();
            }}
            type="primary"
            style={{ paddingVertical: 10 }}
          >
            <Text style={{ color: "white", fontWeight: "600" }}>Done</Text>
          </PressableButton>
          {/* <Button
            style={styles.buttonStyle}
            title="Clear Filters"
            bgColor="white"
            color={colors.primary}
            onPress={() => clearFilterScreen()}
          /> */}
          {/* <Button
            bgColor={colors.primary}
            color="white"
            title="Done"
            onPress={() => {
              navigation.navigate("TVShowsScreen", { filterModified: true });
              // navigation.goBack();
            }}
          /> */}
        </View>
        <View style={styles.groupWrapper}>
          <FilterByTagsContainer
            titleSize={titleSize}
            allFilterTags={getAllFilterTags}
            operatorValues={{ tagOperator, excludeTagOperator }}
            filterFunctions={{
              onAddIncludeTag: addTagToFilter,
              onRemoveIncludeTag: removeTagFromFilter,
              onAddExcludeTag: addExcludeTagToFilter,
              onRemoveExcludeTag: removeExcludeTagFromFilter,
              setTagOperator,
              setExcludeTagOperator,
              clearFilterTags,
            }}
          />
        </View>
        <Divider style={{ backgroundColor: "black", marginTop: 10 }} />
        <View style={[styles.groupWrapper, { flex: 1, flexDirection: "column" }]}>
          <FilterByGenreContainer
            titleSize={titleSize}
            allGenreFilters={getAllFilterGenres}
            genreOperator={genreOperator}
            filterFunctions={{
              addGenreToFilter,
              removeGenreFromFilter,
              setGenreOperator,
              clearFilterGenres,
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // margin: 5,
    // padding: 5,
    // backgroundColor: colors.background,
    // borderColor: "black",
    // borderWidth: 1,
  },
  groupWrapper: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonStyle: {
    width: 150,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    ...styleHelpers.buttonShadow,
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
});

export default ViewTVShowsFilterScreen;
