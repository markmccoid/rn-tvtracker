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
import { colors, fonts, seasonConstants } from "../../globalStyles";
import PressableButton from "../common/PressableButton";
import SeasonHeaderButtonRow from "./SeasonHeaderButtonRow";

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

  const allWatched = !!(episodesWatched === numberOfEpisodes);
  const allUnwatched = !!(episodesWatched === 0);

  const styles = StyleSheet.create({
    textStyle: {
      fontFamily: fonts.family.seasons,
      fontSize: fonts.sizes.m,
      fontWeight: "500",
      color: "#1F380B",
    },
  });
  return (
    <View
      style={{
        flexDirection: "row",
        marginLeft: 10,
        alignItems: "center",
      }}
    >
      <Text style={styles.textStyle}>Watched: </Text>
      <Animated.Text style={[yStyle, styles.textStyle]}>{episodesWatched}</Animated.Text>
      <Text style={styles.textStyle}>{` of ${numberOfEpisodes}`}</Text>
      <View style={{ width: 10 }} />
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
  const state = useOState();
  const actions = useOActions();

  const episodesWatched = state.oSaved.getSeasonEpisodeStateCount(tvShowId, seasonNumber);
  const episodesDownloaded = state.oSaved.getSeasonEpisodeStateCount(
    tvShowId,
    seasonNumber,
    true
  );

  const allEpisodesWatched = !!(episodesWatched === numberOfEpisodes);
  const noEpisodesWatched = !!(episodesWatched === 0);

  // Get styles
  const styles = stylesFunc({ allEpisodesWatched });
  const seasonTitle =
    seasonName === `Season ${seasonNumber}` || seasonNumber === 0
      ? seasonName
      : `Season ${seasonNumber} - ${seasonName}`;

  return (
    <View key={seasonNumber} style={styles.container}>
      <View style={styles.seasonName}>
        <Text style={styles.seasonText} numberOfLines={1}>
          {seasonTitle}
        </Text>

        {/* {isShowSaved && (
          <EpisodesWatched
            episodesWatched={episodesWatched}
            numberOfEpisodes={numberOfEpisodes}
          />
        )} */}
      </View>
      <SeasonHeaderButtonRow
        episodesWatched={episodesWatched}
        numberOfEpisodes={numberOfEpisodes}
        tvShowId={tvShowId}
        seasonNumber={seasonNumber}
        episodesDownloaded={episodesDownloaded}
        EpisodesWatchedComponent={
          isShowSaved && (
            <EpisodesWatched
              episodesWatched={episodesWatched}
              numberOfEpisodes={numberOfEpisodes}
            />
          )
        }
      />
    </View>
  );
};

const stylesFunc = (props) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: seasonConstants.seasonHeaderHeight,
      backgroundColor: props.allEpisodesWatched ? colors.darkbg : "#d5e3ca", //colors.listBackground,
      borderWidth: 1,
    },
    seasonName: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      padding: 5,
    },
    seasonText: {
      fontSize: fonts.sizes.l,
      fontWeight: "600",
      color: props.allEpisodesWatched ? colors.darkfg : colors.darkText,
      fontFamily: fonts.family.seasons,
    },
    markButtons: {
      backgroundColor: "#E7E7E7",
      paddingVertical: 3,
      paddingHorizontal: 1,
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.buttonPrimaryBorder,
    },
    markButtonsText: {
      fontSize: 12,
    },
  });

export default React.memo(SeasonHeader);
