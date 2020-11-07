import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import { useOState, useOActions } from "../../../store/overmind";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
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
              navigation.navigate("Movies", { returning: true, filterModified: true });
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
