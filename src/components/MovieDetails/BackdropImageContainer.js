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
  const { width } = Dimensions.get("window");
  const { actions } = useOvermind();
  const { updateMovieBackdropImage } = actions.oSaved;

  // callback for when image isSelected
  // saves to store the sets state so gallery not shown anymore
  const handleImageSelect = backdropURL => {
    updateMovieBackdropImage({
      movieId: movie.id,
      backdropURL
    });
    setInImageSelect(false);
  };
  // Get backdrop images for passed movieId
  // only get images if bdImages state is true
  React.useEffect(() => {
    const getImages = async () => {
      let imageArray = await movieGetImages(movie.id, "backdrops");
      // push the current backdrop to the front of the array
      imageArray = [movie.backdropURL, ...imageArray.data];
      setbdImages(imageArray);
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
        <ImageSwiper
          images={bdImages}
          onImageSelect={handleImageSelect}
          width={width}
          height={width * 0.53}
        />
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
