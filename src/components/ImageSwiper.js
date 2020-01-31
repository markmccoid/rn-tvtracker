import React from "react";
import {
  Dimensions,
  Image,
  TouchableHighlight,
  View,
  StyleSheet
} from "react-native";
import Carousel from "react-native-snap-carousel";

const ImageSwiper = ({ images, onImageSelect }) => {
  let width = Dimensions.get("window").width; //300
  let height = Dimensions.get("window").width * 0.53; //169

  let CRef = React.useRef();
  let [currItem, setCurrItem] = React.useState(0);
  const _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          borderColor: "white",
          borderWidth: 1,
          backgroundColor: "white",
          width: width - 18,
          height: (width - 18) * 0.53
        }}
      >
        <TouchableHighlight
          onPress={() => {
            console.log("image pressed", CRef.current.currentIndex);
            onImageSelect(images[CRef.current.currentIndex]);
          }}
        >
          <Image
            style={{ width: width - 20, height: (width - 20) * 0.53 }}
            source={{ uri: item }}
          />
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        ref={CRef}
        layout="stack"
        layoutCardOffset={14}
        onSnapToItem={slideIndex => setCurrItem(slideIndex)}
        data={images}
        renderItem={_renderItem}
        sliderWidth={width}
        sliderHeight={200}
        itemWidth={width}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB"
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5"
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9"
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold"
  }
});
export default ImageSwiper;

{
  /* <Swiper style={styles.wrapper} height={169}>
      <Image
        source={{
          uri: "https://image.tmdb.org/t/p/w300/qbaIViX3tgWSTSFXbldq0ODMdi4.jpg"
        }}
        style={{ flex: 1, width, height }}
      />
      <Image
        source={{
          uri: "https://image.tmdb.org/t/p/w300/1SwAVYpuLj8KsHxllTF8Dt9dSSX.jpg"
        }}
        style={{ flex: 1, width, height }}
      />
      <Image
        source={{
          uri: "https://image.tmdb.org/t/p/w300/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg"
        }}
        style={{ flex: 1, width, height }}
      />
    </Swiper> */
}
