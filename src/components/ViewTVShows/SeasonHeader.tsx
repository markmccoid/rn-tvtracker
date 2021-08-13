import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MotiView, useAnimationState } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";

import OpenButton from "../common/OpenButton";

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
  const animationState = useAnimationState({
    from: {
      backgroundColor: "black",
    },
    to: {
      backgroundColor: "white",
    },
    active: {
      backgroundColor: "#8cf382",
    },
  });
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
            <Text
              style={[{ fontSize: 14, marginLeft: 5 }]}
            >{`${episodesWatched} of ${numberOfEpisodes}`}</Text>
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
