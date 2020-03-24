import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Overlay } from "react-native-elements";
import { useNavigation } from "react-navigation-hooks";
import { useOvermind } from "../store/overmind";
import { movieGetImages } from "tmdb_api";
import ImageSwiper from "../components/ImageSwiper";

const ConfirmDelete = ({
  showConfirmDelete,
  setShowConfirmDelete,
  onDeleteMovie
}) => {
  return (
    <Overlay
      isVisible={showConfirmDelete}
      width={Dimensions.get("window").width * 0.75}
      height={Dimensions.get("window").height * 0.2}
      overlayStyle={{ borderColor: "black", borderWidth: 1, borderRadius: 5 }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between"
        }}
      >
        <Text style={{ fontSize: 24, textAlign: "center", marginTop: 25 }}>
          Really Delete Movie?
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 25
          }}
        >
          <Button title="Cancel" onPress={() => setShowConfirmDelete(false)} />
          <Button title="Delete" onPress={onDeleteMovie} />
        </View>
      </View>
    </Overlay>
  );
};

const ViewMovieItem = ({ movie, inImageSelect, setInImageSelect }) => {
  const [posterImages, setPosterImages] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { navigate } = useNavigation();
  const { state, actions } = useOvermind();
  const { deleteMovie } = actions.oSaved;
  const numberOfTags = state.oSaved.getMovieTags(movie.id).length;

  // Called when getting image gallery
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

  const handleDeleteMovie = () => {
    setShowConfirmDelete(true);
    //deleteMovie(movie.id);
  };
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setInImageSelect(false);
            navigate("MovieDetail", { movie, numberOfTags });
          }}
          onLongPress={() => setInImageSelect(true)}
        >
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
        </TouchableOpacity>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Button
            onPress={handleDeleteMovie}
            containerStyle={{
              width: 50,
              justifyContent: "center",
              borderColor: "black",
              borderWidth: 1
            }}
            buttonStyle={{ backgroundColor: "#cc0000" }}
            icon={<Icon name="trash" size={25} />}
          />
        </View>
      </View>
      <ConfirmDelete
        showConfirmDelete={showConfirmDelete}
        setShowConfirmDelete={setShowConfirmDelete}
        onDeleteMovie={() => deleteMovie(movie.id)}
      />
    </View>
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
