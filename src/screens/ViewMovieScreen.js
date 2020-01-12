import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Button } from "react-native";
// import { Button } from "react-native-elements";
// import { useMovieStore } from "../store/createMovieStore";
// import { useMovieState } from "../context/MovieDataContext";
import { useOvermind } from "../store/overmind";
import ViewMovieItem from "../components/ViewMovieItem";

const ViewMovieScreen = ({ navigation }) => {
  //const movies = useMovieStore(state => state.movies);
  // const { savedMovies } = useMovieState();
  const flatListRef = React.useRef();
  const { state } = useOvermind();

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offest: 0 });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.resultList}>
        <FlatList
          data={state.oSaved.savedMovies}
          keyExtractor={(movie, idx) => movie.id.toString() + idx}
          renderItem={({ item }) => {
            return <ViewMovieItem movie={item} />;
          }}
          numColumns={2}
        />
        <Text>View Movie Screen</Text>
      </View>
      <Button
        onPress={() => navigation.navigate("MovieDetail")}
        title="Movie Detail"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultList: {
    flexDirection: "column",
    alignItems: "center"
  }
});
export default ViewMovieScreen;
