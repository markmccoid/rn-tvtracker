import React from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { Overlay } from "react-native-elements";
import { useDimensions } from "@react-native-community/hooks";
import { useOState, useOActions } from "../../../store/overmind";
import { Button } from "../../../components/common/Buttons";

import TagCloud, { TagItem } from "../../../components/TagCloud/TagCloud";

const ViewMovieOverlay = ({
  movieId,
  isVisible,
  movieDetails,
  setMovieEditingId,
}) => {
  const { width, height } = useDimensions().window;
  const state = useOState();
  const actions = useOActions();
  const { getAllMovieTags } = state.oSaved;
  const { deleteMovie, addTagToMovie, removeTagFromMovie } = actions.oSaved;

  let posterWidth = width / 2;
  let posterHeight = posterWidth * 1.5;

  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={() => setMovieEditingId(undefined)}
      overlayStyle={{
        backgroundColor: "#e9e4f0",
        margin: 10,
        borderColor: "black",
        borderWidth: 1,
      }}
      animationType="fade"
    >
      <>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{movieDetails?.title}</Text>
        </View>
        <View style={styles.imageAndButtons}>
          <Image
            source={{ uri: movieDetails?.posterURL }}
            style={{ width: posterWidth, height: posterHeight }}
          />
          <View style={styles.buttonsWrapper}>
            <Button
              onPress={() => setMovieEditingId(undefined)}
              title="Close"
              bgColor="#96c93d"
              bgOpacity="cc"
              medium
              wrapperStyle={{ marginBottom: 15 }}
              width={posterWidth * 0.7}
            />
            <Button
              onPress={() => {
                deleteMovie(movieId);
                setMovieEditingId(undefined);
              }}
              title="Delete"
              bgColor="#b20a2c"
              bgOpacity="cc"
              medium
              width={posterWidth * 0.7}
            />
          </View>
        </View>
        <View style={styles.tagCloudWrapper}>
          <TagCloud>
            {getAllMovieTags(movieId).map((tagObj) => {
              return (
                <TagItem
                  key={tagObj.tagId}
                  tagId={tagObj.tagId}
                  tagName={tagObj.tagName}
                  isSelected={tagObj.isSelected}
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
        </View>
      </>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  titleWrapper: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginHorizontal: -10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  imageAndButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  buttonsWrapper: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  tagCloudWrapper: {
    marginBottom: 20,
    marginLeft: 10,
  },
});

export default ViewMovieOverlay;
