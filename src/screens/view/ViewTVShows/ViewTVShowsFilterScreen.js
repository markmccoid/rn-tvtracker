import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ButtonGroup, Divider } from "react-native-elements";
import { useOState, useOActions } from "../../../store/overmind";
import _ from "lodash";

import { colors, styleHelpers } from "../../../globalStyles";
import { Button } from "../../../components/common/Buttons";
import FilterByTagsContainer from "../../../components/Filter/FilterByTagsContainer";
import FilterByGenreContainer from "../../../components/Filter/FilterByGenreContainer";

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
          }}
        >
          <Button
            style={styles.buttonStyle}
            title="Clear Filters"
            bgColor="white"
            color={colors.primary}
            onPress={() => clearFilterScreen()}
          />
          <Button
            bgColor={colors.primary}
            color="white"
            title="Done"
            onPress={() => {
              navigation.navigate("TVShowsScreen", { filterModified: true });
              // navigation.goBack();
            }}
          />
        </View>
        <View>
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
        <View style={{ flex: 1, flexDirection: "column", marginTop: 10 }}>
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
    margin: 5,
    // backgroundColor: colors.background,
    // borderColor: "black",
    // borderWidth: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonStyle: {
    width: 150,
  },
});

export default ViewTVShowsFilterScreen;
