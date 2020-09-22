import React, { useEffect } from "react";
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
} from "react-native";
import { Button, CircleButton } from "../../../components/common/Buttons";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { useCastData } from "../../../hooks/useCastData";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import {
  Transitioning,
  Transition,
  TransitioningView,
} from "react-native-reanimated";

import {
  CaretDownIcon,
  CaretRightIcon,
  ImagesIcon,
} from "../../../components/common/Icons";

import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import PickImage from "./PickImage";

import ViewSavedMovieDetails from "./ViewSavedMovieDetails";
import { TouchableOpacity } from "react-native-gesture-handler";
// Need to figure out how to have multiple transition sets for a single transitioning view
// OR maybe wrap both in their own transitioning view
const transition = (
  <Transition.Together>
    <Transition.In durationMs={400} type="scale" interpolation="linear" />
    <Transition.Change durationMs={400} interpolation="easein" />
    <Transition.Out durationMs={300} type="scale" interpolation="linear" />
  </Transition.Together>
);

const transition2 = (
  <Transition.Together>
    <Transition.In durationMs={400} type="fade" interpolation="linear" />
    <Transition.Change durationMs={400} interpolation="easein" />
    <Transition.Out durationMs={300} type="fade" interpolation="linear" />
  </Transition.Together>
);

const ViewDetails = ({ navigation, route }) => {
  // const ref = React.useRef(null);
  // const [viewTags, setViewTags] = React.useState(false);
  // // Also used for toValue in animations
  // // 0 = opened
  // // 1 = closed -- The one is the value it is going TO, and 1 will be open.
  // const [viewPickImage, setPickImage] = React.useState(1);
  // // using to control when the animation is done in PickImage
  // // vpiAnimation = 'closing' means the button is closing the pick image component
  // const [vpiAnimation, setvpiAnimation] = React.useState(undefined);
  // // Animated Icons
  // const iconAnim = React.useRef(new Animated.Value(0)).current;

  let movieId = route.params?.movieId;

  let { state, actions } = useOvermind();
  //If no movie param, then assume coming from saved movie and get details
  let movie =
    route.params?.movie === undefined
      ? state.oSaved.getMovieDetails(movieId)
      : route.params.movie;

  // let tags = state.oSaved.getAllMovieTags(movieId);
  // let assignedTags = state.oSaved.getMovieTags(movieId);
  // let { removeTagFromMovie, addTagToMovie } = actions.oSaved;
  const { width, height } = useDimensions().window;

  // const Rotate = (toValue) => {
  //   Animated.timing(iconAnim, {
  //     toValue,
  //     duration: 500,
  //   }).start();
  // };

  // Set the title to the current movie title
  navigation.setOptions({ title: movie.title });
  //Use navigation.setOptions to add the + icon for
  //movies that are not added yet.

  if (movieId) {
    return <ViewSavedMovieDetails movieId={movieId} />;
  }
  if (movie) {
    const castData = useCastData(movie.id);
    return (
      <View style={{ flex: 1 }}>
        <Image
          style={{
            position: "absolute",
            width,
            height,
            resizeMode: "cover",
            opacity: 0.3,
          }}
          source={{
            uri: movie.backdropURL,
          }}
        />
        <ScrollView style={{ flex: 1 }}>
          <DetailMainInfo movie={movie} />
          <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
            <Button
              onPress={() =>
                Linking.openURL(`imdb:///title/${movie.imdbId}`).catch(
                  (err) => {
                    Linking.openURL(
                      "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                    );
                  }
                )
              }
              title="Open in IMDB"
              bgOpacity="ff"
              bgColor="#52aac9"
              small
              width={width / 2}
              wrapperStyle={{
                borderRadius: 0,
              }}
              color="#fff"
              noBorder
            />
          </View>
          <View style={styles.castInfo}>
            {castData.map((person) => (
              <DetailCastInfo
                person={person}
                screenWidth={width}
                key={person.personId}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({});
//`imdb:///find?q=${movie.title}`
export default ViewDetails;
