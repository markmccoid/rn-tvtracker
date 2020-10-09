import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Button } from "../../../components/common/Buttons";
import { useOvermind } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";

import { colors } from "../../../globalStyles";
import { useCastData } from "../../../hooks/useCastData";
import { useRecommendedData } from "../../../hooks/useRecommendedData";
import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import SearchResultItem from "../../../components/search/SearchResultItem";
import DetailRecommendations from "./DetailRecommendations";

const ViewSearchedMovieDetails = ({ movie }) => {
  const { width, height } = useDimensions().window;
  let { state, actions } = useOvermind();
  const { saveMovie, deleteMovie } = actions.oSaved;
  const castData = useCastData(movie.id);

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{
          position: "absolute",
          width,
          height,
          resizeMode: "cover",
          opacity: 0.3,
        }}
        source={{
          uri: movie.backdropURL,
        }}
      />
      <ScrollView style={{ flex: 1 }}>
        <DetailMainInfo movie={movie} />
        <View style={{ flex: 1, alignItems: "center", marginBottom: 10 }}>
          <Button
            onPress={() =>
              Linking.openURL(`imdb:///title/${movie.imdbId}`).catch((err) => {
                Linking.openURL(
                  "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                );
              })
            }
            title="Open in IMDB"
            bgOpacity="ff"
            bgColor={colors.primary}
            small
            width={width / 2}
            wrapperStyle={{
              borderRadius: 0,
            }}
            color="#fff"
            noBorder
          />
        </View>
        <View style={{ borderColor: "blue", borderWidth: 1 }}>
          <Text></Text>
        </View>

        <DetailRecommendations movieId={movie.id} />

        <View style={styles.castInfo}>
          {castData.map((person) => (
            <DetailCastInfo
              person={person}
              screenWidth={width}
              key={person.personId}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  castInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
});

export default ViewSearchedMovieDetails;
