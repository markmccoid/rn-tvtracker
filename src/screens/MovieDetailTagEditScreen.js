import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigationParam } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";
import { Button } from "react-native-elements";
import TagCloud, { TagItem } from "../components/TagCloud/TagCloud";

const MovieDetailTagEditScreen = ({ navigation }) => {
  const movie = useNavigationParam("movie");
  const { state, actions } = useOvermind();
  const { getAllMovieTags } = state.oSaved;
  const { addTagToMovie, removeTagFromMovie } = actions.oSaved;
  // console.log("TAGNAMES", getMovieTags(movie.id));
  // console.log("UNUSED TAGNAMES", getUnusedMovieTags(movie.id));
  // let movieTags = getMovieTags(movie.id);
  // let unusedTags =

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{movie.title}</Text>

        <TagCloud>
          {getAllMovieTags(movie.id).map(tagObj => {
            return (
              <TagItem
                key={tagObj.tagId}
                tagId={tagObj.tagId}
                tagName={tagObj.tagName}
                isSelected={tagObj.isSelected}
                onSelectTag={() =>
                  addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
                }
                onDeSelectTag={() =>
                  removeTagFromMovie({
                    movieId: movie.id,
                    tagId: tagObj.tagId
                  })
                }
              />
            );
          })}
        </TagCloud>
      </View>

      <Button title="Done" onPress={() => navigation.goBack()} />
    </View>
  );
};

// MovieDetailTagEditScreen.navigationOptions = ({ navigation }) => {
//   let movie = navigation.getParam("movie");

//   return {
//     title: "Tag Edit"
//   };
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    margin: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5
  },
  movieInfo: {
    flex: 1,
    justifyContent: "space-between"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  image: {
    width: 300,
    height: 169,
    borderColor: "black",
    borderWidth: 1
  },
  tagStyle: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1
  },
  appliedStyle: {
    backgroundColor: "green"
  }
});

export default MovieDetailTagEditScreen;
