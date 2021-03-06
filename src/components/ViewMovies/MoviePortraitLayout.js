import React from 'react';
import { View, Text, Image, StyleSheet, LayoutAnimation } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDimensions } from '@react-native-community/hooks';

import { useOvermind } from '../../store/overmind.js';
import { DeleteIcon, CheckIcon, HeartIcon } from '../common/Icons';

const MoviePortraitLayout = ({
  movie,
  setMovieEditingId,
  navigateToDetails,
  inEditState,
}) => {
  const { width, height } = useDimensions().window;
  // Import Overmind state and actions
  const { state, actions } = useOvermind();
  const { deleteMovie, addTagToMovie, removeTagFromMovie } = actions.oSaved;
  const { getAllMovieTags } = state.oSaved;
  const movieReleaseDate = movie.releaseDate?.formatted || ' - ';

  //NOTE-- posterURL images are 300 x 450
  // Height is 1.5 times the width
  let posterWidth = width / 2.2;
  let posterHeight = posterWidth * 1.5;

  const styles = StyleSheet.create({
    posterImage: {
      width: posterWidth,
      height: posterHeight,
    },
    movieCard: {
      width: '100%',
      marginVertical: 5,
      margin: 5,
      width: posterWidth,
      borderWidth: 1,
      borderRadius: 2,
      borderColor: '#ddd',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
      elevation: 1,
    },
  });
  return (
    <View style={styles.movieCard}>
      <TouchableOpacity
        onPress={navigateToDetails}
        onLongPress={() =>
          inEditState ? setMovieEditingId() : setMovieEditingId(movie.id)
        }
      >
        <View>
          <Image style={styles.posterImage} source={{ uri: movie.posterURL }} />
        </View>
      </TouchableOpacity>
      {/* Icon row */}
    </View>
  );
};

export default MoviePortraitLayout;
