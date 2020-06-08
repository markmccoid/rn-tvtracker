import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchResultItem = ({ movie, saveMovie }) => {
  return (
    <View
      style={[styles.container, movie.existsInSaved && styles.existsInSaved]}
    >
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text>{movie.overview}</Text>
        {!movie.existsInSaved && (
          <Button title="Add" onPress={() => saveMovie(movie)} />
        )}
      </View>
      <Image
        source={{ url: movie.posterURL }}
        style={styles.image}
        PlaceholderContent={<MaterialIcons name="broken-image" size={64} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'row',
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 225,
    borderColor: 'black',
    borderWidth: 1,
  },
  existsInSaved: {
    borderColor: 'green',
    backgroundColor: 'lightgreen',
    borderWidth: 2,
  },
});

export default React.memo(SearchResultItem);
