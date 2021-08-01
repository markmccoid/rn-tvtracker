import React, { useEffect } from "react";
import { View, Animated, StyleSheet, TouchableOpacity, Dimensions, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MotiView, AnimatePresence } from "moti";

import { useOState, useOActions } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { useCastData } from "../../../hooks/useCastData";
import { Transitioning, Transition } from "react-native-reanimated";

import { colors } from "../../../globalStyles";
import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import HidableView from "../../../components/common/HidableView";
import { CaretRightIcon, ImagesIcon } from "../../../components/common/Icons";

import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import DetailWatchProviders from "./DetailWatchProviders";
import DetailRecommendations from "./DetailRecommendations";
import DetailVideos from "./DetailVideos";
import AnimatedPickImage from "./AnimatedPickImage";
import HiddenContainer from "../../../components/HiddenContainer/HiddenContainer";
import DetailSelectTags from "./DetailSelectTags";
import DetailButtonBar from "./DetailButtonBar";

//@types
import {
  DetailSeasonsScreenRouteProp,
  DetailSeasonsScreenNavigation,
  DetailPersonScreenRouteProp,
  DetailPersonScreenNavigation,
} from "../viewTypes";
import { TVShowDetails } from "../../../store/oSaved/actions";

// Need to figure out how to have multiple transition sets for a single transitioning view
// OR maybe wrap both in their own transitioning view
const transition = (
  <Transition.Together>
    <Transition.In durationMs={400} type="scale" interpolation="linear" />
    <Transition.Change durationMs={400} interpolation="easeIn" />
    <Transition.Out durationMs={3000} type="scale" interpolation="linear" />
  </Transition.Together>
);

const transition2 = (
  <Transition.Sequence>
    <Transition.Out durationMs={100} type="fade" interpolation="linear" />
    <Transition.Together>
      <Transition.In durationMs={300} type="fade" interpolation="linear" />
      <Transition.In durationMs={300} type="scale" interpolation="linear" />
    </Transition.Together>
    <Transition.Change durationMs={100} interpolation="easeIn" />
  </Transition.Sequence>
);
type Props = {
  tvShow: TVShowDetails;
  isInSavedTVShows: boolean;
};
const ViewTVShowDetails = ({ tvShow, isInSavedTVShows }: Props) => {
  const tvShowId = tvShow?.id;
  const ref = React.useRef(null);
  const [viewTags, setViewTags] = React.useState(false);
  const [posterHeight, setPosterHeight] = React.useState(500);

  // Also used for toValue in animations
  // 0 = opened
  // 1 = closed -- The one is the value it is going TO, and 1 will be open.
  const [viewPickImage, setPickImage] = React.useState(1);

  // Animated Icons
  const iconAnim = React.useRef(new Animated.Value(0)).current;

  const castData = useCastData(tvShowId);
  const state = useOState();
  const actions = useOActions();
  // let movie = state.oSaved.getMovieDetails(tvShowId);
  let tags = state.oSaved.getAllTVShowTags(tvShowId);
  let assignedTags = state.oSaved.getTVShowTags(tvShowId);
  let { removeTagFromTVShow, addTagToTVShow } = actions.oSaved;
  const { width, height } = useDimensions().window;

  const navigation = useNavigation<DetailSeasonsScreenNavigation>();
  const personNavigation = useNavigation<DetailSeasonsScreenNavigation>();
  const route = useRoute<DetailSeasonsScreenRouteProp>();
  const personRoute = useRoute<DetailPersonScreenRouteProp>();

  const Rotate = (toValue) => {
    Animated.timing(iconAnim, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (!tvShow) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      {/* {isInSavedTVShows && <UserRating tvShowId={tvShowId} />} */}
      <DetailMainInfo
        tvShow={tvShow}
        isInSavedTVShows={isInSavedTVShows}
        viewTags={viewTags}
        setViewTags={setViewTags}
        transitionRef={ref}
      />
      {/* Saved Details button Bar and components
        ------------------------------------------- */}
      <View
        style={{
          borderWidth: 1,
          borderRadius: 10,
          margin: 5,
          width: width / 2,
          backgroundColor: colors.primary,
        }}
      >
        <TouchableOpacity
          style={{ padding: 5, alignItems: "center" }}
          onPress={() => {
            navigation.navigate("DetailSeasons", {
              tvShowId: tvShow.id,
              seasonNumbers: tvShow?.seasons.map((show) => show.seasonNumber),
              logo: { showName: tvShow.name },
            });
          }}
        >
          <Text style={{ color: "white" }}>{`View ${
            tvShow?.seasons.filter((s) => s.seasonNumber !== 0).length
          } Seasons`}</Text>
        </TouchableOpacity>
      </View>
      {isInSavedTVShows && (
        <View>
          <Transitioning.View ref={ref} transition={transition2}>
            <DetailSelectTags
              viewTags={viewTags}
              tags={tags}
              onSelectTag={(tagObj) =>
                addTagToTVShow({ tvShowId: tvShow.id, tagId: tagObj.tagId })
              }
              removeTagFromTVShow={(tagObj) =>
                removeTagFromTVShow({
                  tvShowId: tvShow.id,
                  tagId: tagObj.tagId,
                })
              }
            />

            <HidableView visible={!viewTags}>
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
                        removeTagFromTVShow({
                          tvShowId: tvShow.id,
                          tagId: tagObj.tagId,
                        })
                      }
                    />
                  );
                })}
              </TagCloud>
            </HidableView>
          </Transitioning.View>
        </View>
      )}
      <DetailButtonBar
        viewTags={viewTags}
        setViewTags={setViewTags}
        viewPickImage={viewPickImage}
        setPickImage={setPickImage}
        imdbId={tvShow.imdbId}
        tvShowName={tvShow.name}
        isInSavedTVShows={isInSavedTVShows}
      />

      <View style={{ overflow: "visible", zIndex: 10 }}>
        {isInSavedTVShows && (
          <AnimatePresence>
            {!!!viewPickImage && (
              <MotiView
                from={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: posterHeight,
                }}
                transition={{
                  type: "timing",
                  duration: 500,
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
              >
                <AnimatedPickImage tvShowId={tvShow.id} setPosterHeight={setPosterHeight} />
              </MotiView>
            )}
          </AnimatePresence>
        )}
      </View>
      {/* <Transitioning.View>
        {isInSavedTVShows && (
          <View>
            {!!!viewPickImage && (
              <PickImage
                tvShowId={tvShow.id}
                setViewPickImage={setPickImage}
                vpiAnimation={vpiAnimation}
              />
            )}
          </View>
        )}
      </Transitioning.View> */}
      {/* ------------------------------------------- 
         END Saved Details button Bar and components 
         ------------------------------------------- */}
      <HiddenContainer style={{ marginBottom: 10 }} title="Where To Watch">
        <DetailWatchProviders tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 5 }} title="Recommendations">
        <DetailRecommendations tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 5 }} title="Videos">
        <DetailVideos tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 10 }} title="Cast" startOpen>
        <View>
          <View style={styles.castInfo}>
            {castData.map((person, idx) => (
              <TouchableOpacity
                key={person.personId + idx.toString()}
                onPress={() => {
                  personNavigation.push(`${personRoute.name}Person`, {
                    personId: person.personId,
                    fromRouteName: route.name,
                  });
                }}
              >
                <DetailCastInfo person={person} screenWidth={width} key={person.personId} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </HiddenContainer>
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
export default ViewTVShowDetails;
