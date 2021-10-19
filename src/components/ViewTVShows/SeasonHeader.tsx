import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { MotiView, useAnimationState, MotiText, AnimatePresence } from "moti";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { useOState, useOActions } from "../../store/overmind";
import { colors, fonts } from "../../globalStyles";

const { width, height } = Dimensions.get("window");

const EpisodesWatched = ({ episodesWatched, numberOfEpisodes }) => {
  const yVal = useSharedValue(0);

  React.useEffect(() => {
    yVal.value = withSequence(withTiming(10), withTiming(0));
  }, [episodesWatched]);

  //--- Code for episode watched progress bar
  // const animWidth = useSharedValue(0);
  // animWidth.value = ((width - 20) / numberOfEpisodes) * episodesWatched || 0;
  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     width: withSpring(animWidth.value),
  //     // width: withTiming(animWidth.value, { duration: 4000 }),
  //     backgroundColor: "#abcabcaa",
  //     position: "absolute",
  //     height: 20,
  //     bottom: 0,
  //     left: -10,
  //     // borderTopRightRadius: 15,
  //     borderWidth: StyleSheet.hairlineWidth,
  //     borderLeftWidth: 0,
  //   };
  // });

  const yStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: yVal.value }],
    };
  });
  const styles = StyleSheet.create({
    textStyle: {
      fontFamily: fonts.family.seasons,
    },
  });
  return (
    <View style={{ flexDirection: "row", marginLeft: 10, paddingBottom: 5 }}>
      {/* <Animated.View style={[animatedStyle]} /> */}
      <Text style={styles.textStyle}>Watched: </Text>
      {/* <Text>{`${episodesWatched} of ${numberOfEpisodes}`}</Text> */}
      <Animated.Text style={[yStyle, styles.textStyle]}>{episodesWatched}</Animated.Text>
      <Text style={styles.textStyle}>{` of ${numberOfEpisodes}`}</Text>
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
const SeasonHeader = ({
  tvShowId,
  seasonNumber,
  seasonName,
  numberOfEpisodes,
  isShowSaved,
}) => {
  //const { seasonState, toggleSeasonState } = headerDetail;
  // const toggleSeasonState = () => {};
  const state = useOState();
  const action = useOActions();

  const episodesWatched = state.oSaved.getWatchedEpisodes(tvShowId, seasonNumber);
  const allEpisodesWatched = !!(episodesWatched === numberOfEpisodes);
  const seasonTitle =
    seasonName === `Season ${seasonNumber}` || seasonNumber === 0
      ? seasonName
      : `Season ${seasonNumber} - ${seasonName}`;

  return (
    <View key={seasonNumber}>
      <View
        style={[
          styles.seasonName,
          {
            backgroundColor: allEpisodesWatched ? colors.darkbg : colors.listBackground,
          },
        ]}
      >
        <View style={{ flexDirection: "column" }}>
          <Text
            style={[
              styles.seasonText,
              {
                color: allEpisodesWatched ? colors.darkfg : colors.darkText,
              },
            ]}
          >
            {seasonTitle}
          </Text>
          {isShowSaved && (
            <EpisodesWatched
              episodesWatched={episodesWatched}
              numberOfEpisodes={numberOfEpisodes}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seasonName: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    height: 60,
    // borderColor: "#aaa123",
    // padding: 5,
    // marginBottom: 5,
    // backgroundColor: "#ddd",
    backgroundColor: colors.listBackground,
  },
  seasonText: {
    // fontSize: 18,
    fontSize: fonts.sizes.l,
    fontWeight: "600",
    padding: 5,
    color: colors.darkText,
    fontFamily: fonts.family.seasons,
  },
});

export default React.memo(SeasonHeader);
