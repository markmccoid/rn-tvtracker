import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useOvermind } from '../../../store/overmind';
import { useImageDims } from '../../../hooks/useImageDims';
import { movieGetImages } from '@markmccoid/tmdb_api';

const getImages = async (movieId) => {
  const posterImages = await movieGetImages(movieId, 'posters');
  return posterImages.data;
};

const PickImage = ({ movieId }) => {
  const [posterData, setPosterData] = React.useState([]);
  const { posterWidth, posterHeight } = useImageDims('m');
  const { state, actions } = useOvermind();
  const { getCurrentImageUrls } = state.oSaved;
  const { updateMoviePosterImage } = actions.oSaved;

  // Called once on mount with array of posterURLs and when new poster is selected
  // They are annotated with isCurrentImage
  // final object is { posterURL: string, isCurrentImage: boolean }
  const updatePosterData = (data, currentPoster) => {
    let annotatedData = data.map((poster) => {
      // after mount 'data' will be an object vs array
      let posterURL = poster.posterURL || poster;
      if (posterURL === currentPoster) {
        return { posterURL, isCurrentImage: true };
      }
      return { posterURL, isCurrentImage: false };
    });
    setPosterData(annotatedData);
  };

  // If current poster is changed, then update the posterData state and the store
  const updateCurrentPoster = (posterURL) => {
    if (posterURL !== getCurrentImageUrls(movieId).currentPosterURL) {
      updatePosterData(posterData, posterURL);
      updateMoviePosterImage({ movieId, posterURL });
    }
  };

  React.useEffect(() => {
    const currentPoster = getCurrentImageUrls(movieId).currentPosterURL;
    getImages(movieId).then((data) => updatePosterData(data, currentPoster));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pick Image</Text>
      <ScrollView>
        <View style={styles.scroll}>
          {posterData.map((posterObj, idx) => {
            let { posterURL, isCurrentImage } = posterObj;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => updateCurrentPoster(posterURL)}
              >
                <Image
                  style={[
                    {
                      width: posterWidth,
                      height: posterHeight,
                      borderWidth: isCurrentImage ? 2 : 0,
                      borderColor: 'red',
                    },
                    styles.image,
                  ]}
                  source={{ uri: posterURL }}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  scroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  image: {
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
export default PickImage;
