import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { MotiView, useAnimationState } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const EpisodesWatched = ({ episodesWatched, numberOfEpisodes }) => {
  const animWidth = useSharedValue(0);
  animWidth.value = ((width - 20) / numberOfEpisodes) * episodesWatched;
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(animWidth.value),
      // width: withTiming(animWidth.value, { duration: 4000 }),
      backgroundColor: "#abcabcaa",
      position: "absolute",
      height: 15,
      bottom: 0,
      left: -10,
      borderTopRightRadius: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderLeftWidth: 0,
    };
  });
  return (
    <View style={{ flexDirection: "row", marginLeft: 10, paddingBottom: 10 }}>
      <Animated.View style={[animatedStyle]} />
      <Text>Episodes Watched: </Text>
      <Text>{`${episodesWatched} of ${numberOfEpisodes}`}</Text>
    </View>
  );
};

type Props = {
  headerDetail: {
    seasonTitle: string;
    seasonNumber: number;
    seasonState: boolean;
    numberOfEpisodes: number;
    episodesWatched: number;
    toggleSeasonState: () => void;
  };
};
const SeasonHeader = ({ headerDetail }: Props) => {
  const {
    seasonTitle,
    seasonNumber,
    seasonState,
    numberOfEpisodes,
    episodesWatched,
    toggleSeasonState,
  } = headerDetail;

  const x = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: x.value,
        },
      ],
    };
  });

  return (
    <View key={seasonNumber}>
      <Pressable
        onPress={() => {
          // If seasonState is true (showing episodes)
          if (seasonState) {
            x.value = withSequence(withTiming(-70), withTiming(0));
          } else {
            x.value = withSequence(withTiming(70), withTiming(0));
          }
          // if (animationState.current === "active") {
          //   animationState.transitionTo("to");
          // } else {
          //   animationState.transitionTo("active");
          // }
          toggleSeasonState();
        }}
      >
        {/* <MotiView
          state={animationState}
          style={styles.seasonName}
          transition={{ type: "timing", duration: 500 }}
        > */}
        <Animated.View style={[styles.seasonName, animatedStyle]}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.seasonText}>{seasonTitle}</Text>
            <EpisodesWatched
              episodesWatched={episodesWatched}
              numberOfEpisodes={numberOfEpisodes}
            />
          </View>
          {/* <MotiView
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 3,
              borderRadius: 5,
            }}
            animate={{ backgroundColor: seasonState ? "#15be48" : "#245240aa" }}
            transition={{ type: "timing", duration: 1000 }}
          >
            <OpenButton isOpen={seasonState} toggleFunction={toggleSeasonState} />
          </MotiView> */}
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa123",
    // padding: 5,
    marginBottom: 5,
    backgroundColor: "white",
  },
  seasonText: {
    fontSize: 18,
    padding: 5,
  },
});

export default SeasonHeader;
function sequence(arg0: number, arg1: number): number {
  throw new Error("Function not implemented.");
}
