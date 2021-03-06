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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          width: width,
          //backgroundColor: "#3b544199",
        }}
      >
        <View style={styles.posterWrapper}>
          <Image
            style={styles.posterImage}
            source={movieURL}
            resizeMode="contain"
          />
        </View>
        <View style={{ width: width - 145, paddingTop: 10, paddingLeft: 5 }}>
          <Text style={{ fontSize: 16 }}>{overview}</Text>
          <Text style={{ fontSize: 18 }}>
            Released on {releaseDate.formatted}
          </Text>
          <Text style={{ fontSize: 18 }}>Length: {runtime} minutes</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  posterWrapper: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2.5, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
  },
  posterImage: {
    width: 130,
    height: 200,
  },
});
export default DetailMainInfo;
