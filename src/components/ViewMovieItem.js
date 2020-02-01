import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import { useNavigation } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";
import { movieGetImages } from "tmdb_api";
import ImageSwiper from "../components/ImageSwiper";

const ViewMovieItem = ({ movie, inImageSelect, setInImageSelect }) => {
  const [posterImages, setPosterImages] = useState([]);
  const { navigate } = useNavigation();
  const { actions } = useOvermind();
  const { deleteMovie } = actions.oSaved;

  useEffect(() => {
    const getImages = async () => {
      let imageArray = await movieGetImages(movie.id, "posters");
      // push the current backdrop to the front of the array
      imageArray = [movie.posterURL, ...imageArray.data];
      setPosterImages(imageArray);
    };
    if (!inImageSelect) {
      setPosterImages([]);
    } else {
      getImages();
    }
  }, [inImageSelect]);

  // callback for when image isSelected
  // saves to store the sets state so gallery not shown anymore
  const handleImageSelect = posterURL => {
    actions.oSaved.updateMoviePosterImage({
      movieId: movie.id,
      posterURL
    });
    setInImageSelect(false);
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setInImageSelect(false);
        navigate("MovieDetail", { movie });
      }}
      onLongPress={() => setInImageSelect(true)}
    >
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          {/* <EvilIcons name="heart" size={20} /> */}
          {!inImageSelect ? (
            <Image source={{ url: movie.posterURL }} style={styles.image} />
          ) : (
            <ImageSwiper
              images={posterImages}
              onImageSelect={handleImageSelect}
              width={150}
              height={225}
            />
          )}
        </View>
        <View style={styles.movieInfo}>
          <Text numberOfLines={1} style={styles.title}>
            {movie.title}
          </Text>
        </View>
        <View>
          <Button onPress={() => deleteMovie(movie.id)} title="Delete" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 2 - 10,
    flexDirection: "column",
    elevation: 1,
    borderRadius: 5,
    backgroundColor: "#eae7ea",
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
    //paddingRight: 10,
    marginTop: 10,
    marginBottom: 6,
    borderColor: "#555",
    borderWidth: 1
  },
  movieInfo: {
    padding: 4,
    alignItems: "center"
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold"
  },
  image: {
    width: 150,
    height: 225,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5
  }
});

export default ViewMovieItem;
