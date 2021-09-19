import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import { useOState, useOActions } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { useCastData } from "../../../hooks/useCastData";

import { colors } from "../../../globalStyles";

import DetailMainInfo from "./DetailMainInfo";
import DetailCastInfo from "./DetailCastInfo";
import DetailWatchProviders from "./DetailWatchProviders";
import DetailRecommendations from "./DetailRecommendations";
import DetailVideos from "./DetailVideos";
import HiddenContainer from "../../../components/HiddenContainer/HiddenContainer";
import DetailButtonBar from "./DetailButtonBar";
import DetailToggleTags from "./DetailToggleTags";

//@types
import {
  DetailSeasonsScreenNavigation,
  DetailPersonScreenNavigation,
  DetailsScreenRouteProp,
} from "../viewTypes";
import { TVShowDetails } from "../../../store/oSaved/actions";

type Props = {
  tvShow: TVShowDetails;
  isInSavedTVShows: boolean;
};
const ViewTVShowDetails = ({ tvShow, isInSavedTVShows }: Props) => {
  const tvShowId = tvShow?.id;
  const ref = React.useRef(null);
  const [viewTags, setViewTags] = React.useState(false);

  const castData = useCastData(tvShowId);

  const { width } = useDimensions().window;

  const navigation = useNavigation<
    DetailSeasonsScreenNavigation | DetailPersonScreenNavigation
  >();
  // const personNavigation = useNavigation<DetailPersonScreenNavigation>();
  const route = useRoute<DetailsScreenRouteProp>();

  if (!tvShow) {
    return null;
  }
  return (
    <View style={{ flex: 1 }}>
      {/* {isInSavedTVShows && <UserRating tvShowId={tvShowId} />} */}
      <DetailMainInfo
        tvShow={tvShow}
        isInSavedTVShows={isInSavedTVShows}
        viewTags={viewTags}
        setViewTags={setViewTags}
        transitionRef={ref}
      />

      {isInSavedTVShows && <DetailToggleTags tvShowId={tvShow.id} />}

      <DetailButtonBar tvShow={tvShow} />

      {/* ------------------------------------------- 
         END Saved Details button Bar and components 
         ------------------------------------------- */}
      <HiddenContainer style={{ marginBottom: 10 }} title="Where To Watch">
        <DetailWatchProviders tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 5 }} title="Recommendations">
        <DetailRecommendations tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 5 }} title="Videos">
        <DetailVideos tvShowId={tvShow.id} />
      </HiddenContainer>

      <HiddenContainer style={{ marginVertical: 10 }} title="Cast" startOpen>
        <View>
          <View style={styles.castInfo}>
            {castData.map((person, idx) => (
              <TouchableOpacity
                key={person.personId + idx.toString()}
                onPress={() => {
                  navigation.push(`${route.name}Person`, {
                    personId: person.personId,
                    fromRouteName: route.name,
                  });
                }}
              >
                <DetailCastInfo person={person} screenWidth={width} key={person.personId} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </HiddenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  castInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: "#ffffff85",
  },
  tagItem: {
    borderWidth: 1,
    borderColor: colors.listBorder,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 4,
    backgroundColor: `${colors.includeGreen}55`,
  },
  tagEdit: {
    backgroundColor: colors.includeGreen,
    borderRadius: 3,
    fontWeight: "bold",
  },
});
//`imdb:///find?q=${movie.title}`
export default ViewTVShowDetails;
