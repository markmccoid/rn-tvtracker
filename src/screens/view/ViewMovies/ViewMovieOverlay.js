import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Overlay } from "react-native-elements";
import { useDimensions } from "@react-native-community/hooks";
import { useOState, useOActions } from "../../../store/overmind";
import { Button } from "../../../components/common/Buttons";
import { MoreIcon } from "../../../components/common/Icons";

import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";
import PosterImage from "../../../components/common/PosterImage";
import { colors, styleHelpers } from "../../../globalStyles";

const ViewMovieOverlay = ({ movieId, isVisible, movieDetails, setTVShowEditingId }) => {
  const { width } = useDimensions().window;
  const state = useOState();
  const actions = useOActions();
  const { getAllMovieTags } = state.oSaved;
  const { deleteMovie, addTagToMovie, removeTagFromMovie } = actions.oSaved;

  const allMovieTags = getAllMovieTags(movieId);
  let posterWidth = width / 3.2;
  let posterHeight = posterWidth * 1.5;
  let buttonContainerWidth = posterWidth + 10;
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setTVShowEditingId(undefined)}
      overlayStyle={{
        backgroundColor: colors.tagListbg, //"#e9e4f0",
        marginHorizontal: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 15,
        width: width - 20,
      }}
      backdropStyle={{
        backgroundColor: "#ffffffcc",
      }}
      animationType="fade"
    >
      <>
        <View style={styles.titleWrapper}>
          <View
            style={{
              paddingTop: 10,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Text style={styles.title}>{movieDetails?.title}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                paddingVertical: 10,
                marginHorizontal: 10,
                justifyContent: "center",
                backgroundColor: colors.tagListbg,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            onPress={() => {
              setTVShowEditingId(undefined);
            }}
          >
            <MoreIcon size={25} />
          </Pressable>
        </View>
        <View style={[styles.imageAndTagRow, { height: posterHeight * 1.2 }]}>
          <View style={styleHelpers.posterImageShadow}>
            <PosterImage
              uri={movieDetails?.posterURL}
              posterWidth={posterWidth}
              posterHeight={posterHeight}
              placeholderText={movieDetails?.title}
              style={{
                borderRadius: 10,
              }}
            />
          </View>
          <ScrollView style={styles.tagCloudWrapper}>
            <TagCloud>
              {allMovieTags.map((tagObj) => {
                return (
                  <TagItem
                    key={tagObj.tagId}
                    tagId={tagObj.tagId}
                    tagName={tagObj.tagName}
                    isSelected={tagObj.isSelected}
                    size="s"
                    onSelectTag={() =>
                      addTagToMovie({
                        movieId: movieId,
                        tagId: tagObj.tagId,
                      })
                    }
                    onDeSelectTag={() =>
                      removeTagFromMovie({
                        movieId: movieId,
                        tagId: tagObj.tagId,
                      })
                    }
                  />
                );
              })}
            </TagCloud>
          </ScrollView>
        </View>
        <View style={{ width: buttonContainerWidth, alignItems: "center" }}>
          <Button
            onPress={() => {
              deleteMovie(movieId);
              setTVShowEditingId(undefined);
            }}
            title="Delete"
            color="white"
            bgColor={colors.excludeRed}
            medium
            wrapperStyle={{ marginBottom: 5 }}
            width={posterWidth * 0.7}
          />
        </View>
      </>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    flexDirection: "row",
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginHorizontal: -10,
    marginTop: -10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  imageAndTagRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  tagCloudWrapper: {
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default ViewMovieOverlay;
