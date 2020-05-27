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

const DetailMainInfo = ({ movie }) => {
  const { width, height } = useDimensions().window;
  // If poster doesn't exist use the placeholder image
  let movieURL = movie.posterURL
    ? { uri: movie.posterURL }
    : require('./placeholder.png');
  // Get data to use from movie object
  const { overview = '', releaseDate = '', imdbURL = '', runtime = '' } = movie;
  return (
    <View>
      {/* <Image
        style={{
          width,
          height: 200,
        }}
        resizeMode="cover"
        source={{
          uri: movie.backdropURL,
        }}
      /> */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          width: width,
          //backgroundColor: "#3b544199",
        }}
      >
        <Image
          style={{ width: 130, height: 200, marginRight: 10 }}
          source={movieURL}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 16, width: width - 145, paddingTop: 10 }}>
          {overview}
        </Text>
      </View>
      <View
        style={{
          margin: 5,
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 18 }}>{releaseDate.formatted}</Text>
        <Text style={{ fontSize: 18 }}>{runtime}</Text>
      </View>
    </View>
  );
};

export default DetailMainInfo;
