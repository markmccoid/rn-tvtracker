import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Button, CircleButton } from '../../../components/common/Buttons';
import { useOvermind } from '../../../store/overmind';
import { useDimensions } from '@react-native-community/hooks';
import TagCloud, { TagItem } from '../../../components/TagCloud/TagCloud';

import DetailMainInfo from './DetailMainInfo';

const ViewDetails = ({ navigation, route }) => {
  const [viewTags, setViewTags] = React.useState(false);
  let movieId = route.params?.movieId;
  let { state, actions } = useOvermind();
  let movie = state.oSaved.getMovieDetails(movieId);
  let tags = state.oSaved.getAllMovieTags(movieId);
  let { removeTagFromMovie, addTagToMovie } = actions.oSaved;
  const { width, height } = useDimensions().window;
  const dims = useDimensions();

  // Get the Movie details
  // const { posterURL}
  // Set the title to the current movie title
  navigation.setOptions({ title: movie.title });

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{
          position: 'absolute',
          width,
          height,
          resizeMode: 'cover',
          opacity: 0.3,
        }}
        source={{
          uri: movie.posterURL,
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <DetailMainInfo movie={movie} />

        <View style={{ alignItems: 'center' }}>
          <Button
            onPress={() => setViewTags((prev) => !prev)}
            title={viewTags ? 'Hide Tags' : 'Show Tags'}
            bgOpacity="ff"
            bgColor="#52aac9"
            small
            width={100}
            wrapperStyle={{}}
            color="#fff"
            noBorder
          />
        </View>

        <View style={{ display: viewTags ? '' : 'none' }}>
          <TagCloud>
            {tags.map((tagObj) => {
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
        <Button
          onPress={() => navigation.goBack()}
          title="Back"
          bgOpacity="ff"
          bgColor="#52aac9"
          small
          width={100}
          wrapperStyle={{}}
          color="#fff"
          noBorder
        />
      </ScrollView>
    </View>
  );
};

export default ViewDetails;
