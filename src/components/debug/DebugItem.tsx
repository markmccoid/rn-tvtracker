import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { fromUnixTime, format } from "date-fns";

import { SavedTVShowsDoc } from "../../store/oSaved/state";
import { colors } from "../../globalStyles";
import { getEpisodeRunTimeGroup } from "../../utils/helperFunctions";

const formatUnixDate = (unixDate: number) => {
  let formattedDate = "";
  if (unixDate) {
    formattedDate = format(fromUnixTime(unixDate), "MM-dd-yyyy");
  }
  return formattedDate;
};

type Props = {
  item: SavedTVShowsDoc;
};
const DebugItem = ({ item }: Props) => {
  // const nextAirDate = item?.nextAirDate?.epoch;
  // let formattedNextAirDate = "";
  // if (nextAirDate) {
  //   formattedNextAirDate = format(fromUnixTime(nextAirDate), "MM-dd-yyyy");
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.showName}>{`${item.id}-${item.name}`}</Text>
      <View style={{ flexDirection: "column" }}>
        <View style={styles.group}>
          <Text style={styles.label}>Saved:</Text>
          <Text style={styles.data}>{formatUnixDate(item.dateSaved)}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Updated:</Text>
          <Text style={styles.data}>{formatUnixDate(item.dateLastUpdated)}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Next Air:</Text>
          <Text style={styles.data}>{formatUnixDate(item.nextAirDate?.epoch)}</Text>
        </View>

        <View style={styles.group}>
          <Text style={styles.label}>Run Time -- Group:</Text>
          <Text style={styles.data}>
            {item.avgEpisodeRunTime}--{getEpisodeRunTimeGroup(item.avgEpisodeRunTime)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    // borderBottomWidth: 1,
  },
  showName: {
    fontSize: 16,
    fontWeight: "600",
    backgroundColor: colors.imdbYellow,
    borderColor: "green",
    borderWidth: 1,
  },
  group: {
    flexDirection: "row",
  },
  label: {
    fontWeight: "600",
  },
  data: {},
});
export default DebugItem;
