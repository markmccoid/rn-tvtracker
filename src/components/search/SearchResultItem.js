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
  console.log('search result Item', movie.releaseDate);
  return (
    <View
      style={[styles.container, movie.existsInSaved && styles.existsInSaved]}
    >
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.genreContainer}>
          {movie.genres.map((genre) => (
            <Text style={styles.genre}>{genre}</Text>
          ))}
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}> {movie.releaseDate.formatted}</Text>
        </View>
        <Text>{movie.overview}</Text>
        {!movie.existsInSaved && (
          <Button title="Add" onPress={() => saveMovie(movie)} />
        )}
      </View>
      {movie.posterURL ? (
        <Image
          source={{ url: movie.posterURL }}
          style={styles.image}
          PlaceholderContent={<MaterialIcons name="broken-image" size={64} />}
        />
      ) : (
        <View style={[styles.image, styles.imageBackup]}>
          <Text style={styles.imageBackupText}>{movie.title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    margin: 5,
    borderColor: 'black',
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#ecf0f1',
  },
  movieInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  genreContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  genre: {
    padding: 2,
    marginHorizontal: 5,
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 12,
    backgroundColor: '#34495e44',
  },
  dateContainer: {
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  image: {
    width: 150,
    height: 225,
    borderColor: 'black',
    borderWidth: 1,
    marginLeft: 5,
  },
  imageBackup: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackupText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  existsInSaved: {
    borderColor: 'green',
    backgroundColor: 'lightgreen',
    borderWidth: 2,
  },
});

export default React.memo(SearchResultItem);
