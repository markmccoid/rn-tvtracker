import React from "react";
import { View, Text, FlatList, List, StyleSheet, Button } from "react-native";
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
  React.useEffect(() => {
    // navigation.state.params = {
    //   isFiltered: state.oSaved.filterData.tags.length > 0
    // };
    navigation.setParams({
      isFiltered: state.oSaved.filterData.tags.length > 0,
      numFilters: state.oSaved.filterData.tags.length
    });
  }, [state.oSaved.filterData.tags.length]);
  return (
    <View style={styles.resultList}>
      <FlatList
        data={state.oSaved.getFilteredMovies}
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        columnWrapperStyle={{ justifyContent: "space-around" }}
        renderItem={({ item }) => {
          return <ViewMovieItem movie={item} />;
        }}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  resultList: {
    flex: 1
  }
});
export default ViewMovieScreen;
