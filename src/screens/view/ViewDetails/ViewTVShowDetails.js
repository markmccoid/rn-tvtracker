import React, { useEffect } from "react";
import { View, Animated, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useOState, useOActions } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { useCastData } from "../../../hooks/useCastData";
import { Transitioning, Transition } from "react-native-reanimated";

import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import HidableView from "../../../components/common/HidableView";
import { CaretRightIcon, ImagesIcon } from "../../../components/common/Icons";

import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import DetailWatchProviders from "./DetailWatchProviders";
import DetailRecommendations from "./DetailRecommendations";
import DetailVideos from "./DetailVideos";
import PickImage from "./PickImage";
import HiddenContainer from "../../../components/HiddenContainer/HiddenContainer";
import DetailSelectTags from "./DetailSelectTags";
import DetailButtonBar from "./DetailButtonBar";

// Need to figure out how to have multiple transition sets for a single transitioning view
// OR maybe wrap both in their own transitioning view
const transition = (
  <Transition.Together>
    <Transition.In durationMs={400} type="scale" interpolation="linear" />
    <Transition.Change durationMs={400} interpolation="easein" />
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
    <Transition.Change durationMs={100} interpolation="easein" />
  </Transition.Sequence>
);

const ViewTVShowDetails = ({ tvShow, isInSavedTVShows }) => {
  const tvShowId = tvShow?.id;
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

  const castData = useCastData(tvShowId);
  const state = useOState();
  const actions = useOActions();
  // let movie = state.oSaved.getMovieDetails(tvShowId);
  let tags = state.oSaved.getAllTVShowTags(tvShowId);
  let assignedTags = state.oSaved.getTVShowTags(tvShowId);
  let { removeTagFromTVShow, addTagToTVShow } = actions.oSaved;
  const { width, height } = useDimensions().window;

  const navigation = useNavigation();
  const route = useRoute();

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
        setvpiAnimation={setvpiAnimation}
        transitionRef={ref}
        imdbId={tvShow.imdbId}
        tvShowName={tvShow.name}
        isInSavedTVShows={isInSavedTVShows}
      />

      <Transitioning.View>
        {isInSavedTVShows && (
          <View>
            {/* <DetailSelectTags
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
              /> */}

            {!!!viewPickImage && (
              <PickImage
                tvShowId={tvShow.id}
                setViewPickImage={setPickImage}
                vpiAnimation={vpiAnimation}
              />
            )}
          </View>
        )}

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
                  onPress={() =>
                    navigation.push(`${route.name}Person`, {
                      personId: person.personId,
                      fromRouteName: route.name,
                    })
                  }
                >
                  <DetailCastInfo person={person} screenWidth={width} key={person.personId} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </HiddenContainer>
      </Transitioning.View>
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
