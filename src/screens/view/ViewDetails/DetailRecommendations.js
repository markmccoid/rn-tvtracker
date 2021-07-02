import * as React from "react";
import { View, ActivityIndicator, Text, ScrollView } from "react-native";
import SearchResultItem from "../../../components/search/SearchResultItem";
import { useRecommendedData } from "../../../hooks/useRecommendedData";
import { useOActions } from "../../../store/overmind";
import { useRoute } from "@react-navigation/native";

const DetailRecommendations = ({ movieId }) => {
  const flatRef = React.useRef();
  const [recommendations, recommendIsLoading] = useRecommendedData(movieId);
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const route = useRoute();
  const actions = useOActions();
  const { saveTVShow, deleteMovie } = actions.oSaved;

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

  if (recommendations.length === 0 && !recommendIsLoading) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontWeight: "normal", fontSize: 20 }}>No Recommendations Found</Text>
      </View>
    );
  }
  return (
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
            saveTVShow={saveTVShow}
            deleteMovie={deleteMovie}
            setOnDetailsPage={() => {}}
            navigateToScreen={route.name}
          />
        );
      })}
    </ScrollView>
  );
};

export default DetailRecommendations;
