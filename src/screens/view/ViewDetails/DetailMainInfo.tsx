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
import { useNavigation, useRoute } from "@react-navigation/native";
import DetailMainInfoHoldMenu from "./DetailMainInfoHoldMenu";

import { useDimensions } from "@react-native-community/hooks";
import { LessIcon, MoreIcon } from "../../../components/common/Icons";
import { useOActions, useOState } from "../../../store/overmind";
import LongTouchUserRating from "./LongTouchUserRating";
import { Button } from "../../../components/common/Buttons";
import PosterImage from "../../../components/common/PosterImage";
import { colors, styleHelpers } from "../../../globalStyles";
import { TVShowDetails } from "@markmccoid/tmdb_api";

import DatesScroller from "./DatesScroller";
import { AverageEpisodeTimeBlock, ShowStatusBlock, GenresBlock } from "./DetailBlocks";

type Props = {
  tvShow: TVShowDetails;
  isInSavedTVShows: boolean;
  viewTags: boolean;
  setViewTags: (viewTags: boolean) => void;
  transitionRef: React.Ref<View>;
};
const DetailMainInfo: React.FC<Props> = ({
  tvShow,
  isInSavedTVShows,
  viewTags,
  setViewTags,
  transitionRef,
}) => {
  const [overviewHeight, setOverviewHeight] = React.useState(205);
  const actions = useOActions();
  const state = useOState();
  const { updateUserRatingToTVShow, refreshTVShow } = actions.oSaved; //!
  const { getTVShowUserRating } = state.oSaved;
  const navigation = useNavigation();
  const route = useRoute();
  // maybe needs to be in useEffect??? or memoized
  const tvShowUserRating = getTVShowUserRating(tvShow.id);

  const { width } = useDimensions().window;

  const posterWidth = width * 0.35;
  const posterHeight = posterWidth * 1.5;

  // Get data to use from tvShow object
  const {
    overview = "",
    firstAirDate,
    imdbURL = "",
    avgEpisodeRunTime = "",
    lastAirDate,
  } = tvShow;
  const nextAirDate = tvShow.nextEpisodeToAir?.airDate;

  const toggleOverview = () => setOverviewHeight((curr) => (curr ? undefined : 205));
  const navigateToRoute = () =>
    navigation.navigate(route.name, {
      tvShowId: tvShow.id,
      tvShow: undefined,
      notSaved: false,
    });
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: width,
          paddingTop: 5,
          paddingBottom: 15,
          marginBottom: 20,
        }}
      >
        <View
          style={[
            styles.posterWrapper,
            styles.posterImage(posterWidth, posterHeight),
            { zIndex: 200 },
          ]}
        >
          <View
            style={{
              position: "absolute",
              left: 35,
              bottom: -40,
              zIndex: 200,
            }}
          >
            {isInSavedTVShows && (
              <LongTouchUserRating
                // tvShowId={tvShow.id}
                userRating={tvShowUserRating}
                updateUserRating={(userRating) =>
                  updateUserRatingToTVShow({ tvShowId: tvShow.id, userRating })
                }
              />
            )}
          </View>

          <DetailMainInfoHoldMenu
            tvShow={tvShow}
            navigateToRoute={navigateToRoute}
            routeName={route.name}
            isInSavedTVShows={isInSavedTVShows}
            refreshTVShow={refreshTVShow}
          >
            <View style={styleHelpers.posterImageShadow}>
              <PosterImage
                uri={tvShow.posterURL}
                posterWidth={posterWidth}
                posterHeight={posterHeight}
                placeholderText={tvShow?.name}
                style={{
                  borderRadius: 10,
                }}
              />
            </View>
          </DetailMainInfoHoldMenu>
        </View>
        {/*---------------------
          ------------------------*/}
        <View style={{ flex: 1, paddingHorizontal: 8, height: overviewHeight }}>
          <ScrollView style={{ overflow: "scroll" }}>
            <Text style={{ fontSize: 18 }}>{overview}</Text>
          </ScrollView>
          {overview.length > 270 && (
            <View
              style={{
                position: "absolute",
                bottom: -30,
                right: 0,
                margin: 10,
                // backgroundColor: "#ffffff",
                zIndex: 100,
                // borderColor: "black",
                // borderWidth: 1,
                // borderRadius: 10,
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={toggleOverview}>
                {overviewHeight ? (
                  <MoreIcon size={20} color="black" />
                ) : (
                  <LessIcon size={20} color="black" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* Release Date, Length, Genres + ShowTags button */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        {/* DATES Scroller */}
        <DatesScroller
          firstAirDate={firstAirDate}
          lastAirDate={lastAirDate}
          nextAirDate={nextAirDate}
        />
        {/* <View style={[styles.textRow, { flexWrap: "wrap", width: width / 1.5 }]}> */}

        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "column" }}>
            <ShowStatusBlock status={tvShow.status} />
            <AverageEpisodeTimeBlock avgEpisodeRunTime={avgEpisodeRunTime} />
          </View>
        </View>
        <GenresBlock genres={tvShow.genres} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  posterWrapper: {
    borderWidth: 1,
    backgroundColor: colors.background,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    marginRight: 5,
  },
  posterImage: (widthIn: number, heightIn: number): ImageStyle => ({
    width: widthIn,
    height: heightIn,
  }),
  textRow: {
    flexDirection: "row",
  },
  textRowLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});
export default DetailMainInfo;
