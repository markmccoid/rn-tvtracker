import React from 'react';
import { View, Text, Image, StyleSheet, LayoutAnimation } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDimensions } from '@react-native-community/hooks';

import { useOvermind } from '../../store/overmind.js';
import { DeleteIcon, CheckIcon } from '../common/Icons';
import TagCloud, { TagItem } from '../TagCloud/TagCloud';

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
  console.log('IMAGE', movie.posterURL);
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
      marginVertical: 5,
      margin: 5,
      width: posterWidth,
    },
  });
  LayoutAnimation.spring();
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
      <View
        style={{
          marginBottom: 20,
          marginLeft: 10,
          zIndex: 10,
          display: inEditState ? '' : 'none',
        }}
      >
        <TagCloud>
          {getAllMovieTags(movie.id).map((tagObj) => {
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
                    tagId: tagObj.tagId,
                  })
                }
              />
            );
          })}
        </TagCloud>
      </View>
    </View>
  );
};

export default MoviePortraitLayout;
