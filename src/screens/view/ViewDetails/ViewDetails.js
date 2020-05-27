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

import DetailMainInfo from './DetailMainInfo';

const ViewDetails = ({ navigation, route }) => {
  let movieId = route.params?.movieId;
  let { state } = useOvermind();
  let movie = state.oSaved.getMovieDetails(movieId);
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
