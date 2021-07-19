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
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  useAnimatedReaction,
} from "react-native-reanimated";

const ITEM_WIDTH = 130;

export const GenresBlock = ({ genres }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Text style={styles.textRowLabel}>Genre(s): </Text>
      <ScrollView horizontal bounces={true} showsHorizontalScrollIndicator={false}>
        {genres.map((genre, idx) => (
          <Text key={genre} style={{ fontSize: 18 }}>{`${genre}  `}</Text>
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
  textRow: {
    flexDirection: "row",
  },
  textRowLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});
