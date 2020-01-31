import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { useOvermind } from "../../store/overmind";
import { movieGetImages } from "tmdb_api";
import ImageSwiper from "../ImageSwiper";

const BackdropImageContainer = ({ movie }) => {
  const [inImageSelect, setInImageSelect] = React.useState(false);
  const [bdImages, setbdImages] = React.useState([]);
  const { height, width } = Dimensions.get("window");
  const navigation = useNavigation();
  const { actions } = useOvermind();
  const { updateMovieBackdropImage } = actions.oSaved;
  const handleImageSelect = backdropURL => {
    updateMovieBackdropImage({
      movieId: movie.id,
      backdropURL
    });
    setInImageSelect(false);
  };

  React.useEffect(() => {
    const getImages = async () => {
      let imageArray = await movieGetImages(movie.id, "backdrops");
      setbdImages(imageArray.data);
    };
    if (!inImageSelect) {
      setbdImages([]);
    } else {
      getImages();
    }
  }, [inImageSelect]);
  return (
    <View style={styles.imageContainer}>
      {!inImageSelect ? (
        <TouchableOpacity onLongPress={() => setInImageSelect(true)}>
          <Image source={{ url: movie.backdropURL }} style={styles.image} />
        </TouchableOpacity>
      ) : (
        <ImageSwiper images={bdImages} onImageSelect={handleImageSelect} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: Dimensions.get("window").width, //300
    height: Dimensions.get("window").width * 0.53 //169
  },
  imageContainer: {
    height: 200,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderTopWidth: 0.5,
    borderTopColor: "black",
    justifyContent: "center"
  }
});
export default BackdropImageContainer;
