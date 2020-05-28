import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDimensions } from '@react-native-community/hooks';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useOvermind } from '../../store/overmind.js';
import TagCloud, { TagItem } from '../TagCloud/TagCloud';

import MovieColumnLayout from './MovieColumnLayout';
import MoviePortraitLayout from './MoviePortraitLayout';

const ViewMoviesListItem = ({ movie, setMovieEditingId, movieEditingId }) => {
  //Bool letting us know if we are in edit mode for this movieId
  const inEditState = movieEditingId === movie.id;
  const { navigate } = useNavigation();
  const { width, height } = useDimensions().window;

  const navigateToDetails = () => {
    setMovieEditingId(); // clear editing Id
    navigate('Details', { movieId: movie.id });
  };

  return (
    <MoviePortraitLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    />
  );
};

export default ViewMoviesListItem;

/* <MovieColumnLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    /> */
