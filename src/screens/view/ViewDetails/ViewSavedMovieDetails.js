import React, { useEffect } from "react";
import {
  View,
  Animated,
  Text,
  Image,
  ScrollView,
  Linking,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
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
  ExpandDownIcon,
  CollapseUpIcon,
} from "../../../components/common/Icons";

import { colors } from "../../../globalStyles";
import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import DetailRecommendations from "./DetailRecommendations";
import PickImage from "./PickImage";

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

const ViewSavedMovieDetails = ({ movieId }) => {
  const ref = React.useRef(null);
  const [viewTags, setViewTags] = React.useState(false);
  // Also used for toValue in animations
  // 0 = opened
  // 1 = closed -- The one is the value it is going TO, and 1 will be open.
  const [viewPickImage, setPickImage] = React.useState(1);
  // using to control when the animation is done in PickImage
  // vpiAnimation = 'closing' means the button is closing the pick image component
  const [vpiAnimation, setvpiAnimation] = React.useState(undefined);
  // Animated Icons
  const iconAnim = React.useRef(new Animated.Value(0)).current;

  const [viewRecommendations, setViewRecommendations] = React.useState(false);

  const castData = useCastData(movieId);
  let { state, actions } = useOvermind();
  let movie = state.oSaved.getMovieDetails(movieId);
  let tags = state.oSaved.getAllMovieTags(movieId);
  let assignedTags = state.oSaved.getMovieTags(movieId);
  let { removeTagFromMovie, addTagToMovie } = actions.oSaved;
  const { width, height } = useDimensions().window;

  const Rotate = (toValue) => {
    Animated.timing(iconAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (!movie) {
    return null;
  }
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
            onPress={() => {
              if (ref.current) {
                ref.current.animateNextTransition();
              }
              setViewTags((prev) => !prev);
            }}
            title={viewTags ? "Hide Tags" : "Show Tags"}
            bgOpacity="ff"
            bgColor={colors.primary}
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
                  "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                );
              })
            }
            title="Open in IMDB"
            bgOpacity="ff"
            bgColor={colors.primary}
            small
            width={150}
            wrapperStyle={{ borderRadius: 0 }}
            color="#fff"
            noBorder
          />

          <TouchableWithoutFeedback
            onPress={() => {
              Rotate(viewPickImage); //start icon animation
              if (ref.current) {
                ref.current.animateNextTransition();
              }
              viewPickImage === 1
                ? setvpiAnimation("open")
                : setvpiAnimation("closing");
              setPickImage((prevValue) => (prevValue === 0 ? 1 : 0));
            }}
          >
            <View
              style={{
                borderRadius: 0,
                flexDirection: "row",
                padding: 5,
                backgroundColor: colors.primary,
                width: 100,
                justifyContent: "center",
              }}
            >
              <Animated.View
                style={{
                  marginLeft: 5,
                  transform: [
                    {
                      rotate: iconAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "90deg"],
                      }),
                    },

                    {
                      scale: iconAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [1, 1.5, 2],
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

        <Transitioning.View ref={ref} transition={transition2}>
          {viewTags && (
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
          )}

          {!!!viewPickImage && (
            <PickImage
              movieId={movie.id}
              setViewPickImage={setPickImage}
              vpiAnimation={vpiAnimation}
            />
          )}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#ffffff85",
              borderTopColor: "#aaa",
              borderBottomColor: "#aaa",
              borderBottomWidth: 2,
              borderTopWidth: 2,
              marginVertical: 10,
              paddingVertical: 15,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row" }}
              onPress={() => setViewRecommendations((prev) => !prev)}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", marginRight: 15 }}
              >
                Recommendations
              </Text>
              {!viewRecommendations ? (
                <ExpandDownIcon style={{ marginTop: 5 }} size={20} />
              ) : (
                <CollapseUpIcon style={{ marginTop: 5 }} size={20} />
              )}
            </TouchableOpacity>
            {viewRecommendations && (
              <View style={{ marginVertical: 5 }}>
                <DetailRecommendations movieId={movie.id} />
              </View>
            )}
          </View>
          <Text>Cast Info</Text>
          <View style={styles.castInfo}>
            {castData.map((person) => (
              <DetailCastInfo
                person={person}
                screenWidth={width}
                key={person.personId}
              />
            ))}
          </View>
        </Transitioning.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  castInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: "#ffffff85",
  },
});
//`imdb:///find?q=${movie.title}`
export default ViewSavedMovieDetails;
