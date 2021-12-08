import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../../globalStyles/index";
import {
  EyeWatchedIcon,
  EyeNotWatchedIcon,
  TelevisionOffIcon,
} from "../../components/common/Icons";
import PressableButton from "../common/PressableButton";
import { useOState, useOActions } from "../../store/overmind";

type Props = {
  episodesWatched: number;
  episodesDownloaded: number;
  numberOfEpisodes: number;
  tvShowId: number;
  seasonNumber: number;
};
const SeasonHeaderButtonRow = ({
  episodesWatched,
  episodesDownloaded,
  numberOfEpisodes,
  tvShowId,
  seasonNumber,
}: Props) => {
  const state = useOState();
  const actions = useOActions();
  const { isDownloadStateEnabled } = state.oSaved.settings;
  const { markAllSeasonsEpisodes } = actions.oSaved;
  const allWatched = !!(episodesWatched === numberOfEpisodes);
  const allUnwatched = !!(episodesWatched === 0);
  const inlineStyles = StyleSheet.create({
    watchAll: {
      backgroundColor: allWatched ? "#cac9c9" : "white", //colors.includeGreen,
    },
    unwatchAll: {
      backgroundColor: allUnwatched ? "#cac9c9" : "white", // colors.includeGreen,
    },
  });
  return (
    <View style={styles.buttonRow}>
      <View style={{ flexDirection: "row" }}>
        <PressableButton
          disabled={episodesWatched === numberOfEpisodes}
          style={[styles.markButtons, inlineStyles.watchAll]}
          onPress={() =>
            markAllSeasonsEpisodes({ tvShowId, seasonNumber, watchedState: true })
          }
        >
          {/* <Text style={[styles.markButtonsText, { color: colors.darkText }]}>Watch All</Text> */}
          <EyeWatchedIcon size={25} />
        </PressableButton>
        <PressableButton
          disabled={episodesWatched === 0}
          style={[styles.markButtons, inlineStyles.unwatchAll, { marginLeft: 3 }]}
          onPress={() =>
            markAllSeasonsEpisodes({ tvShowId, seasonNumber, watchedState: false })
          }
        >
          {/* <Text style={styles.markButtonsText}>Unwatch All</Text> */}
          <EyeNotWatchedIcon size={25} />
        </PressableButton>
      </View>
      {isDownloadStateEnabled && episodesDownloaded > 0 && (
        <View
          style={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "flex-end",
            marginRight: 3,
          }}
        >
          <PressableButton
            style={[styles.markButtons]}
            onPress={() =>
              markAllSeasonsEpisodes({
                tvShowId,
                seasonNumber,
                watchedState: false,
                modifyDownloadState: true,
              })
            }
          >
            {/* <Text style={[styles.markButtonsText, { color: "white" }]}>Clear Secondary</Text> */}
            <TelevisionOffIcon size={25} />
          </PressableButton>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderWidth: 1,
    // borderColor: "red",
    width: "100%",
    paddingHorizontal: 5,
    // marginTop: -5,
  },

  markButtons: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.buttonPrimaryBorder,
  },
  markButtonsText: {
    fontSize: 16,
    fontFamily: fonts.family.seasons,
    color: colors.darkText,
  },
});

export default SeasonHeaderButtonRow;
