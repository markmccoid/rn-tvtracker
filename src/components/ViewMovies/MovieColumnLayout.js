import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";

import { useOvermind } from "../../store/overmind.js";
import { DeleteIcon, CheckIcon } from "../common/Icons";
import TagCloud, { TagItem } from "../TagCloud/TagCloud";

const MovieColumnLayout = ({
  movie,
  setMovieEditingId,
  navigateToDetails,
  inEditState,
}) => {
  const { width, height } = useDimensions().window;
  // Import Overmind state and actions
  const { state, actions } = useOvermind();
  const { deleteMovie, addTagToMovie, removeTagFromMovie } = actions.oSaved;
  const { getAllMovieTags } = state.oSaved;
  const movieReleaseDate = movie.releaseDate?.formatted || " - ";

  //Image Dimensions
  const imageWidth = width - 20;
  const imageHeight = height / 7;

  return (
    <View>
      <View
        style={{
          position: "absolute",
          marginTop: 20,
          marginLeft: 10,
          zIndex: 10,
          display: inEditState ? "" : "none",
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            paddingLeft: 2,
            paddingTop: 2,
            backgroundColor: "#ff453a",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 35 / 2,
          }}
          onPress={() => {
            deleteMovie(movie.id);
            setMovieEditingId();
          }}
        >
          <DeleteIcon size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          right: 0,
          marginTop: 20,
          marginRight: 10,
          zIndex: 10,
          display: inEditState ? "" : "none",
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            paddingLeft: 2,
            paddingTop: 2,
            backgroundColor: "#34C759",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 35 / 2,
          }}
          onPress={() => setMovieEditingId()}
        >
          <CheckIcon size={20} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={navigateToDetails}
        onLongPress={() =>
          inEditState ? setMovieEditingId() : setMovieEditingId(movie.id)
        }
      >
        <View
          style={{
            margin: 10,
            marginTop: inEditState ? 30 : 10,
            borderColor: "darkgray",
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,

            elevation: 10,
          }}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              resizeMode: "cover",
            }}
            source={{
              uri: movie.backdropURL,
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: -15,
              backgroundColor: "rgba(50,50,0,0.5)",
              borderWidth: 1,
              borderColor: "white",
              borderRadius: 5,
              paddingHorizontal: 4,
              paddingVertical: 2,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                textAlign: "center",
              }}
            >
              {movie.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              width: imageWidth,
            }}
          >
            <View
              style={{
                position: "absolute",
                top: -imageHeight,
                backgroundColor: "rgba(50,50,0,0.5)",
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 5,
                paddingHorizontal: 4,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "white",
                  textAlign: "center",
                }}
              >
                {movieReleaseDate}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          marginBottom: 20,
          marginLeft: 10,
          zIndex: 10,
          display: inEditState ? "" : "none",
        }}
      >
        <TagCloud>
          {getAllMovieTags(movie.id).map((tagObj) => {
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
    </View>
  );
};

export default MovieColumnLayout;
