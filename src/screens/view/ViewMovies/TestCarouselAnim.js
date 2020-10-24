import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Animated,
  Button,
  Image,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { useOState } from "../../../store/overmind";

const { width, height } = Dimensions.get("window");

const SPACING = 10;
const ITEM_SIZE = width * 0.72;
const SPACER_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.6;

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ position: "absolute", width, height: BACKDROP_HEIGHT }}>
      <FlatList
        data={movies}
        horizontal
        initialNumToRender={movies.length}
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * ITEM_SIZE, index * ITEM_SIZE];

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-width, 0],
          });
          return (
            <Animated.View
              style={{
                position: "absolute",
                transform: [{ translateX }],
              }}
            >
              <Image
                source={{ uri: item.posterURL }}
                style={{ width, height: BACKDROP_HEIGHT, resizeMode: "cover" }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={["transparent", "white"]}
        style={{
          width,
          height: BACKDROP_HEIGHT * 0.7,
          position: "absolute",
          bottom: 0,
        }}
      />
    </View>
  );
};

const TestCarouselAnim = ({ navigation }) => {
  const state = useOState();
  const { getFilteredMovies } = state.oSaved;
  const flatListRef = React.useRef();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const movieList = getFilteredMovies("date", "dec");
  return (
    <View style={styles.container}>
      {/* <StatusBar hidden /> */}
      <Backdrop movies={movieList} scrollX={scrollX} />

      <Animated.FlatList
        data={movieList}
        ref={flatListRef}
        // getItemLayout={getItemLayout}
        keyboardDismissMode
        keyExtractor={(movie, idx) => movie.id.toString() + idx}
        // columnWrapperStyle={{ justifyContent: "space-around" }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: SPACER_ITEM_SIZE,
        }}
        horizontal
        decelerationRate={0}
        bounces={false}
        snapToInterval={ITEM_SIZE}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { x: scrollX } },
            },
          ],
          { useNativeDriver: true }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];
          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [150, 100, 150],
          });
          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: "center",
                  backgroundColor: "white",
                  borderRadius: 34,
                  transform: [{ translateY }],
                }}
              >
                <Image style={styles.posterImage} source={{ uri: item.posterURL }} />
                <Text style={{ fontSize: 24 }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text>{item.releaseDate.formatted}</Text>
                <Text style={{ fontSize: 12 }} numberOfLines={3}>
                  {item.overview}
                </Text>
              </Animated.View>
            </View>
          );
        }}
      />
      <Button title="home" onPress={() => navigation.navigate("ViewMovies")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  posterImage: {
    width: "100%",
    height: ITEM_SIZE * 1.2,
    resizeMode: "cover",
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});
export default TestCarouselAnim;
