import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import { useOState, useOActions } from "../../../store/overmind";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import { CommonActions, useFocusEffect, useNavigationState } from "@react-navigation/native";
import _ from "lodash";

const ViewMoviesFilterScreen = ({ route, navigation }) => {
  const state = useOState();
  const actions = useOActions();
  const { getAllFilterTags, getAllFilterGenres } = state.oSaved;
  // const { genres } = state.oSaved.generated;
  const { tagOperator, genreOperator } = state.oSaved.filterData;
  const {
    addTagToFilter,
    removeTagFromFilter,
    clearFilterScreen,
    setTagOperator,
    addGenreToFilter,
    removeGenreFromFilter,
    setGenreOperator,
    clearFilterTags,
    clearFilterGenres,
  } = actions.oSaved;

  // Get the key for the Movies route
  // Used in teh dismiss listener
  const moviesKey = useNavigationState((state) => {
    return state.routes[state.routeNames.indexOf("Movies")].key;
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("UFE-Filter");
  //     return () => {
  //       console.log("returning from UEF -> navigating");
  //       //navigation.navigate("Movies", { returning: true, filterModified: true });
  //       console.log("returning AFTERfrom UEF -> navigating");
  //     };
  //   }, [])
  // );
  // //------------------------------
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("appear", (e) => {
  //     console.log("In Filter Appear");
  //   });

  //   return () => {
  //     unsubscribe();
  //     console.log("Unsub - Appear");
  //   };
  // }, [navigation]);

  // Listener for when a screen is dismissed using the dismiss gesture
  // When this happens we set the filterModified Param for the Movies route
  // Letting the ViewMoviesScreen know that the filter was modified.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("dismiss", (e) => {
      navigation.dispatch({
        ...CommonActions.setParams({ filterModified: true }),
        source: moviesKey,
      });
    });

    return () => {
      unsubscribe();
      // console.log("Unsub - Dismiss");
    };
  }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("transitionStart", (e) => {
  //     if (e.data.closing) {
  //       console.log("Will be Dismiss");
  //     } else {
  //       console.log("WIll Appear");
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  //------------------------------

  //---TESTING  Probably should be a getter in the store.+
  const tagOperators = ["AND", "OR"];
  const genreOperators = ["AND", "OR"];
  return (
    <ScrollView>
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
            type="outline"
            onPress={() => clearFilterScreen()}
          />
          <Button
            style={styles.buttonStyle}
            title="Done"
            onPress={() => {
              navigation.navigate("Movies", { filterModified: true });
              // navigation.goBack();
            }}
          />
        </View>
        <View>
          <Text style={styles.title}>Filter by Tags</Text>
          <ButtonGroup
            onPress={(index) => setTagOperator(tagOperators[index])}
            buttons={tagOperators}
            selectedIndex={tagOperators.indexOf(tagOperator)}
          />
          <TagCloud>
            {getAllFilterTags.map((tagObj) => {
              return (
                <TagItem
                  key={tagObj.tagId}
                  tagId={tagObj.tagId}
                  tagName={tagObj.tagName}
                  isSelected={tagObj.isSelected}
                  onSelectTag={() => addTagToFilter(tagObj.tagId)}
                  onDeSelectTag={() => removeTagFromFilter(tagObj.tagId)}
                />
              );
            })}
          </TagCloud>
        </View>

        <View>
          <Text style={styles.title}>Filter by Genre</Text>
          <ButtonGroup
            onPress={(index) => setGenreOperator(genreOperators[index])}
            buttons={genreOperators}
            selectedIndex={genreOperators.indexOf(genreOperator)}
          />

          <TagCloud>
            {getAllFilterGenres.map((genreObj) => {
              const { genre, isSelected } = genreObj;
              return (
                <TagItem
                  key={genre}
                  tagId={genre}
                  tagName={genre}
                  isSelected={isSelected}
                  onSelectTag={() => addGenreToFilter(genre)}
                  onDeSelectTag={() => removeGenreFromFilter(genre)}
                />
              );
            })}
          </TagCloud>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 5,
    // borderColor: "black",
    // borderWidth: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  buttonStyle: {
    width: 150,
  },
});

export default ViewMoviesFilterScreen;
