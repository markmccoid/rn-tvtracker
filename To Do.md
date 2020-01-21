## To Do

1. Color filter icon if filtering
2. Show filter list if filter is active on main screen
3. Put clear button by list of filters in #2

## MovieDetailTagEditScreen.js OLD

```jsx
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { useNavigationParam } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";
import styled from "styled-components/native";

const TagContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const Tag = styled.TouchableOpacity`
  background-color: ${props => (props.isApplied ? "lightgreen" : "white")};
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 5px;
  align-self: center;
`;

const TagIcon = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MovieDetailTagEditScreen = ({ navigation }) => {
  const movie = useNavigationParam("movie");
  const { state, actions } = useOvermind();
  const { getTags, getMovieTags, getUnusedMovieTags } = state.oSaved;
  const { addTagToMovie, removeTagFromMovie } = actions.oSaved;
  // console.log("TAGNAMES", getMovieTags(movie.id));
  // console.log("UNUSED TAGNAMES", getUnusedMovieTags(movie.id));
  // let movieTags = getMovieTags(movie.id);
  // let unusedTags =
  let allTags = [...getMovieTags(movie.id), ...getUnusedMovieTags(movie.id)];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>

      <TagContainer>
        {getMovieTags(movie.id).map(tagObj => {
          return (
            <Tag
              key={tagObj.tagId}
              onPress={() =>
                tagObj.isApplied
                  ? removeTagFromMovie({
                      movieId: movie.id,
                      tagId: tagObj.tagId
                    })
                  : addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
              }
              isApplied={tagObj.isApplied}
            >
              <TagIcon>
                <AntDesign
                  style={{ paddingRight: 5 }}
                  name={tagObj.isApplied ? "tag" : "tago"}
                  size={20}
                />
                <Text>{tagObj.tagName}</Text>
              </TagIcon>
            </Tag>
          );
        })}
      </TagContainer>

      <TagContainer>
        {getUnusedMovieTags(movie.id).map(tagObj => {
          return (
            <Tag
              key={tagObj.tagId}
              onPress={() =>
                tagObj.isApplied
                  ? removeTagFromMovie({
                      movieId: movie.id,
                      tagId: tagObj.tagId
                    })
                  : addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
              }
              isApplied={tagObj.isApplied}
            >
              <TagIcon>
                <AntDesign
                  style={{ paddingRight: 5 }}
                  name={tagObj.isApplied ? "tag" : "tago"}
                  size={20}
                />
                <Text>{tagObj.tagName}</Text>
              </TagIcon>
            </Tag>
          );
        })}
      </TagContainer>
    </View>
  );
};

MovieDetailTagEditScreen.navigationOptions = ({ navigation }) => {
  let movie = navigation.getParam("movie");

  return {
    title: "Tag Edit"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
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

{
  /* <TagContainer>
        {allTags.map(tagObj => {
          return (
            <Tag
              key={tagObj.tagId}
              onPress={() =>
                tagObj.isApplied
                  ? removeTagFromMovie({
                      movieId: movie.id,
                      tagId: tagObj.tagId
                    })
                  : addTagToMovie({ movieId: movie.id, tagId: tagObj.tagId })
              }
              isApplied={tagObj.isApplied}
            >
              <View style={{ flexDirection: "row" }}>
                <AntDesign
                  style={{ paddingRight: 5 }}
                  name={tagObj.isApplied ? "tag" : "tago"}
                  size={20}
                />
                <Text>{tagObj.tagName}</Text>
              </View>
            </Tag>
          );
        })}
      </TagContainer> */
}
```

```jsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import ViewMovieScreen from "../screens/ViewMovieScreen";
import ViewMoviesFilterScreen from "../screens/ViewMoviesFilterScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";
import MovieDetailTagEditScreen from "../screens/MovieDetailTagEditScreen";

const MainMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieScreen,
      navigationOptions: ({ navigation }) => {
        return {
          title: "View Movies",
          headerRight: (
            <TouchableOpacity
              onPress={() => navigation.navigate("ViewMoviesFilter")}
            >
              <Feather name="filter" size={30} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          )
        };
      }
    },
    ViewMoviesFilter: {
      screen: ViewMoviesFilterScreen
    },
    MovieDetail: {
      screen: MovieDetailScreen
    },
    MovieDetailTagEdit: {
      screen: MovieDetailTagEditScreen
    }
  },
  {
    initialRouteName: "ViewMovies",
    mode: "modal"
  }
);

export default MainMovieStack;
```

```jsx
import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from "react-navigation-stack";
import ViewMovieScreen from "../screens/ViewMovieScreen";
import ViewMoviesFilterScreen from "../screens/ViewMoviesFilterScreen";
import MovieDetailScreen from "../screens/MovieDetailScreen";
import MovieDetailTagEditScreen from "../screens/MovieDetailTagEditScreen";

const ViewMovieStack = createStackNavigator(
  {
    ViewMovies_1: {
      screen: ViewMovieScreen
    },
    ViewMoviesFilter: {
      screen: ViewMoviesFilterScreen
    }
  },
  {
    mode: "modal",
    headerMode: "none"
  }
);

const ViewMovieDetailStack = createStackNavigator({});
const MainMovieStack = createStackNavigator(
  {
    ViewMovies: {
      screen: ViewMovieStack,
      navigationOptions: ({ navigation }) => {
        return {
          title: "View Movies",
          headerRight: (
            <TouchableOpacity
              onPress={() => navigation.navigate("ViewMoviesFilter")}
            >
              <Feather name="filter" size={30} style={{ marginRight: 10 }} />
            </TouchableOpacity>
          )
        };
      }
    },
    MovieDetail: {
      screen: MovieDetailScreen
    },
    MovieDetailTagEdit: {
      screen: MovieDetailTagEditScreen
    }
  },
  {
    initialRouteName: "ViewMovies"
  }
);

export default MainMovieStack;
```
