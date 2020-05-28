import React, { useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import * as Styled from './styles';
import { useOvermind } from '../../../store/overmind';
import ListSearchBar from './ListSearchBar';

import ViewMoviesListItem from '../../../components/ViewMovies/ViewMoviesListItem';

const ViewMoviesScreen = ({ navigation, route }) => {
  //const [showSearch, setShowSearch] = React.useState(false);
  const flatListRef = React.useRef();
  const { state, actions } = useOvermind();
  const { setMovieEditingId } = actions.oAdmin;
  const { movieEditingId } = state.oAdmin.appState;
  const { searchFilter } = state.oSaved;
  const { setSearchFilter } = actions.oSaved;
  const getItemLayout = (data, index) => {
    let height = index === 1 ? 70 : 150;
    return {
      length: height,
      offset: height * index - 70,
      index,
    };
  };
  let showSearch = route.params?.showSearch;
  //Trying to use this to clear editingId when returning from filter screen.
  //Have to set the "returning" param on both the DONE button in the filter screen component
  //and the header "X"(Close).
  //Not sure if setting the param that we are checking in dependancies is good or bad.
  useEffect(() => {
    if (route.params?.returning) {
      setMovieEditingId();
      navigation.setParams({ returning: false });
    }
  }, [route.params?.returning]);

  // When we show the search bar scroll to the top of the flatlist
  useEffect(() => {
    if (showSearch) {
      flatListRef.current.scrollToIndex({ animated: true, index: 0 });
    }
  }, [showSearch]);

  return (
    <View style={styles.containerForPortrait}>
      {showSearch ? <ListSearchBar /> : null}
      <FlatList
        data={state.oSaved.getFilteredMovies}
        ref={flatListRef}
        // getItemLayout={getItemLayout}
        keyboardDismissMode
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        numColumns={2}
        renderItem={({ item, index }) => {
          return (
            <ViewMoviesListItem
              movie={item}
              setMovieEditingId={setMovieEditingId}
              movieEditingId={movieEditingId}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerForColumn: {
    flex: 1,
  },
  containerForPortrait: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default ViewMoviesScreen;
