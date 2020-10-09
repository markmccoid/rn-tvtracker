import * as React from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  ScrollView,
  Linking,
  StyleSheet,
  Dimensions,
} from "react-native";
import SearchResultItem from "../../../components/search/SearchResultItem";
import { useRecommendedData } from "../../../hooks/useRecommendedData";
import { useOvermind } from "../../../store/overmind";
import { useNavigation, useRoute } from "@react-navigation/native";

const DetailRecommendations = ({ movieId }) => {
  const flatRef = React.useRef();
  const [recommendations, recommendIsLoading] = useRecommendedData(movieId);
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const route = useRoute();
  let { actions } = useOvermind();
  const { saveMovie, deleteMovie } = actions.oSaved;

  // Everytime we load the recommendations,
  React.useEffect(() => {
    if (flatRef.current && !recommendIsLoading) {
      flatRef.current.scrollTo({ x: scrollIndex, animated: false });
      setScrollIndex(0);
    }
  }, [recommendIsLoading]);
  // Reset scrollIndex to zero when a new movieId is passed
  React.useEffect(() => {
    setScrollIndex(0);
  }, [movieId]);

  if (recommendIsLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff85",
          borderTopColor: "#ccc",
          borderBottomColor: "#ccc",
          borderBottomWidth: 2,
          borderTopWidth: 2,
          marginVertical: 10,
          paddingVertical: 15,
          height: 200,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    // <View
    //   style={{
    //     backgroundColor: "#ffffff85",
    //     borderTopColor: "#ccc",
    //     borderBottomColor: "#ccc",
    //     borderBottomWidth: 2,
    //     borderTopWidth: 2,
    //     marginVertical: 10,
    //     paddingVertical: 15,
    //   }}
    // >
    <ScrollView
      ref={flatRef}
      horizontal
      scrollEventThrottle={48}
      onScroll={(e) => setScrollIndex(e.nativeEvent.contentOffset.x)}
    >
      {recommendations.map((item) => {
        return (
          <SearchResultItem
            key={item.id}
            movie={item}
            saveMovie={saveMovie}
            deleteMovie={deleteMovie}
            setOnDetailsPage={() => {}}
            navigateToScreen={route.name}
          />
        );
      })}
    </ScrollView>

    // </View>
  );
};

export default DetailRecommendations;
