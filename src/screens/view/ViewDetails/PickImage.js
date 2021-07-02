import React from "react";
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import PosterImage from "../../../components/common/PosterImage";
import { useOState, useOActions } from "../../../store/overmind";
import { useImageDims } from "../../../hooks/useImageDims";
import { tvGetImages } from "@markmccoid/tmdb_api";

const getImages = async (tvShowId) => {
  const posterImages = await tvGetImages(tvShowId, "posters");
  return posterImages.data;
};

const PickImage = ({ tvShowId, vpiAnimation, setViewPickImage }) => {
  const [posterData, setPosterData] = React.useState([]);
  const [largeImage, setLargeImage] = React.useState(undefined);
  const [posterWidth, posterHeight] = useImageDims("m");
  const [posterWidthLarge, posterHeightLarge] = useImageDims("l");
  // Get the opacity animation value
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  // Get Overmind store data
  const state = useOState();
  const actions = useOActions();
  const { getCurrentImageUrls } = state.oSaved;
  const { updateTVShowPosterImage } = actions.oSaved;

  const heightOfView = posterData.length > 2 ? 2.25 : 1.25;
  // console.log('heigthofview', heightOfView);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };
  const fadeOut = () => {
    // Start the fade out animation
    // At the end set the pickImage state from ViewDetails back to false
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: false,
    }).start(() => setViewPickImage(1));
  };
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
    if (posterURL !== getCurrentImageUrls(tvShowId).currentPosterURL) {
      updatePosterData(posterData, posterURL);
      updateTVShowPosterImage({ tvShowId, posterURL });
    }
  };

  React.useEffect(() => {
    const currentPoster = getCurrentImageUrls(tvShowId).currentPosterURL;
    getImages(tvShowId).then((data) => updatePosterData(data, currentPoster));
    fadeIn();
  }, []);

  React.useEffect(() => {
    if (vpiAnimation === "closing") {
      fadeOut();
    }
  }, [vpiAnimation]);
  if (largeImage) {
    return (
      <View style={styles.largeImageContainer}>
        <TouchableOpacity onPress={() => setLargeImage(undefined)}>
          <PosterImage
            uri={largeImage}
            posterWidth={posterWidthLarge}
            posterHeight={posterHeightLarge}
          />
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          height: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, posterHeight * heightOfView],
          }),
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Pick Image</Text>
      </View>
      <ScrollView>
        <View style={styles.scroll}>
          {posterData.map((posterObj, idx) => {
            let { posterURL, isCurrentImage } = posterObj;
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => updateCurrentPoster(posterURL)}
                onLongPress={() => setLargeImage(posterURL)}
              >
                <View style={styles.imageShadow}>
                  <PosterImage
                    uri={posterURL}
                    style={[
                      {
                        width: posterWidth,
                        height: posterHeight,
                        borderWidth: isCurrentImage ? 2 : 0,
                        borderColor: "red",
                      },
                      styles.image,
                    ]}
                    posterWidth={posterWidth}
                    posterHeight={posterHeight}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
  },
  scroll: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingTop: 7,
  },
  imageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 2.5, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    marginBottom: 10,
  },
  headerContainer: {
    backgroundColor: "#ccc",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    padding: 10,
  },
  largeImageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  largeImage: {
    width: 300,
    height: 400,
  },
});

export default PickImage;
