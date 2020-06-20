import React, { useEffect } from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  ScrollView,
  Linking,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { Button, CircleButton } from '../../../components/common/Buttons';
import { useOvermind } from '../../../store/overmind';
import { useDimensions } from '@react-native-community/hooks';
import { useCastData } from '../../../hooks/useCastData';
import TagCloud, { TagItem } from '../../../components/TagCloud/TagCloud';
import {
  CaretDownIcon,
  CaretRightIcon,
  ImagesIcon,
} from '../../../components/common/Icons';

import DetailMainInfo from './DetailMainInfo';
import DetailCastInfo from './DetailCastInfo';
import PickImage from './PickImage';

const ViewDetails = ({ navigation, route }) => {
  const [viewTags, setViewTags] = React.useState(false);
  const [viewPickImage, setPickImage] = React.useState(false);
  // using to control when the animation is done in PickImage
  // vpiAnimation = 'closing' means the button is closing the pick image component
  const [vpiAnimation, setvpiAnimation] = React.useState(undefined);
  // Animated Icons
  const iconAnim = React.useRef(new Animated.Value(0)).current;

  let movieId = route.params?.movieId;
  const castData = useCastData(movieId);
  let { state, actions } = useOvermind();
  let movie = state.oSaved.getMovieDetails(movieId);
  let tags = state.oSaved.getAllMovieTags(movieId);
  let assignedTags = state.oSaved.getMovieTags(movieId);
  let { removeTagFromMovie, addTagToMovie } = actions.oSaved;
  const { width, height } = useDimensions().window;
  const dims = useDimensions();

  const RotateDown = () => {
    Animated.timing(iconAnim, {
      toValue: 90,
      duration: 500,
    }).start();
  };
  const RotateUp = () => {
    Animated.timing(iconAnim, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  // Set the title to the current movie title
  navigation.setOptions({ title: movie.title });

  // useEffect(() => {
  //   console.log('in useeffect DETAIL');
  //   const getCredits = async () => {
  //     movieGetCredits(movie.id).then((resp) => setCast(resp.data.cast));
  //   };
  //   getCredits();
  // }, []);
  // console.log('CREDITS', cast);
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
        <View>
          <TagCloud>
            {assignedTags.map((tagObj) => {
              return (
                <TagItem
                  key={tagObj.tagId}
                  tagId={tagObj.tagId}
                  tagName={tagObj.tagName}
                  isSelected={tagObj.isSelected}
                  size="s"
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
        <View style={styles.buttonBar}>
          <Button
            onPress={() => setViewTags((prev) => !prev)}
            title={viewTags ? 'Hide Tags' : 'Show Tags'}
            bgOpacity="ff"
            bgColor="#52aac9"
            small
            width={100}
            wrapperStyle={{ borderRadius: 0 }}
            color="#fff"
            noBorder
          />
          <Button
            onPress={() =>
              Linking.openURL(`imdb:///title/${movie.imdbId}`).catch((err) => {
                Linking.openURL(
                  'https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525'
                );
              })
            }
            title="Open in IMDB"
            bgOpacity="ff"
            bgColor="#52aac9"
            small
            width={150}
            wrapperStyle={{ borderRadius: 0 }}
            color="#fff"
            noBorder
          />
          {/* <Button
            onPress={() => {
              if (viewPickImage) {
                RotateUp(); //start icon animation
              } else {
                RotateDown();
              }
              setPickImage(!viewPickImage);
            }}
            bgOpacity="ff"
            bgColor="#52aac9"
            small
            width={100}
            wrapperStyle={{ borderRadius: 0, flexDirection: 'row', padding: 5 }}
            color="#fff"
            noBorder
            before={
              <Animated.View
                style={{
                  marginLeft: 5,
                  transform: [
                    {
                      rotate: iconAnim.interpolate({
                        inputRange: [0, 90],
                        outputRange: ['0deg', '90deg'],
                      }),
                    },
                  ],
                }}
              >
                <CaretRightIcon size={20} color="white" />
              </Animated.View>
            }
            after={
              <ImagesIcon size={20} color="white" style={{ marginLeft: 20 }} />
            }
          /> */}
          <TouchableWithoutFeedback
            onPress={() => {
              if (viewPickImage) {
                RotateUp(); //start icon animation
              } else {
                RotateDown();
              }
              if (!vpiAnimation || vpiAnimation === 'closing') {
                setPickImage(true);
                setvpiAnimation('opening');
              } else if (vpiAnimation === 'opening') {
                setvpiAnimation('closing');
              }
            }}
          >
            <View
              style={{
                borderRadius: 0,
                flexDirection: 'row',
                padding: 5,
                backgroundColor: '#52aac9',
                width: 100,
                justifyContent: 'center',
              }}
            >
              <Animated.View
                style={{
                  marginLeft: 5,
                  transform: [
                    {
                      rotate: iconAnim.interpolate({
                        inputRange: [0, 90],
                        outputRange: ['0deg', '90deg'],
                      }),
                    },
                  ],
                }}
              >
                <CaretRightIcon size={20} color="white" />
              </Animated.View>
              <ImagesIcon size={20} color="white" style={{ marginLeft: 20 }} />
            </View>
          </TouchableWithoutFeedback>
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

        {viewPickImage && (
          <PickImage
            movieId={movie.id}
            setViewPickImage={setPickImage}
            vpiAnimation={vpiAnimation}
          />
        )}

        <View style={styles.castInfo}>
          {castData.map((person) => (
            <DetailCastInfo
              person={person}
              screenWidth={width}
              key={person.personId}
            />
          ))}
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

const styles = StyleSheet.create({
  castInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 414,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: '#ffffff85',
  },
});
//`imdb:///find?q=${movie.title}`
export default ViewDetails;
