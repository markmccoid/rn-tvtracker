import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ImageStyle,
} from "react-native";
import { colors } from "../../../globalStyles";

import { LinearGradient } from "expo-linear-gradient";
// import Animated, {
//   useSharedValue,
//   useAnimatedRef,
//   useDerivedValue,
//   scrollTo,
//   useAnimatedReaction,
// } from "react-native-reanimated";

const GenreView = ({ genre }) => {
  return (
    <View style={styles.genreItem}>
      <Text key={genre} style={{ fontSize: 16 }}>{`${genre}`}</Text>
    </View>
  );
};
export const GenresBlock = ({ genres }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.textRowLabel}>Genre(s): </Text>
      <ScrollView horizontal bounces={true} showsHorizontalScrollIndicator={false}>
        {genres.map((genre, idx) => (
          <GenreView key={genre} genre={genre} />
        ))}
      </ScrollView>
    </View>
  );
};

export const ShowStatusBlock = ({ status }) => {
  return (
    <View style={styles.textRow}>
      <Text style={styles.textRowLabel}>Status:</Text>
      <Text style={{ fontSize: 18 }}>{status}</Text>
    </View>
  );
};
export const AverageEpisodeTimeBlock = ({ avgEpisodeRunTime }) => {
  if (!avgEpisodeRunTime) return null;

  return (
    <View style={styles.textRow}>
      <Text style={styles.textRowLabel}>Length: </Text>
      <Text style={{ fontSize: 18 }}>{avgEpisodeRunTime} minutes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  genreItem: {
    borderWidth: 1,
    borderColor: colors.listBorder,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
  },
  textRow: {
    flexDirection: "row",
  },
  textRowLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});
