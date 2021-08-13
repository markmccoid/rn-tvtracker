import React, { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, ScrollView, View, Image, Dimensions } from "react-native";
import { AddIcon, DeleteIcon } from "../../../components/common/Icons";
import { useOState, useOActions } from "../../../store/overmind";
import { colors } from "../../../globalStyles";
//@types
import { DetailsScreenProps } from "../viewTypes";
import { TVShowDetails } from "../../../store/oSaved/actions";

import ViewTVShowDetails from "./ViewTVShowDetails";

import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");
/**
 * The ViewDetails screen can show the details for a tv show in two states:
 * 1. The tv show already exists in your saved tv shows
 * 2. The tv show is from the search area and is not yet saved in your saved tv shows
 *
 * In Case #1, the params object will have a "movieId" key which will be used to load the movie
 * details from the store
 *
 * In Case #2, the params object will have a "movie" key with the movie details populated from
 * the search screen.  This will give you a yellowbox error in RNN v5 because it is a non serailzied object,
 * but it is ok to ignore.
 * The other param passed with Case #2 is "notSaved" which when true indicates that this navigate has a movie that
 * is NOT saved.  I used this negative way so that if we don't get this param passed we can safely assume that the
 * navigation event is coming from a place where the movie is saved.
 *
 *
 *
 * @param {*} { navigation, route }
 * @returns
 */
//* I need to revist both of the above cases.  I don't want to get any details other than a tvShowId
//* from BOTH cases.  Then I will look up the details in tmdb_api
//*
//* We do need to determine if the movie is in our saved list.  We could still use a param "notSaved"
//* but that seems confusing.  Instead, why not create an Overmind derived getter that accepts
//* a tvShowId and return true(saved) or false(not saved)?
//* -- isTVShowSaved(tvShowId: number): boolean
//*
//*
const ViewDetails = ({ navigation, route }: DetailsScreenProps) => {
  // console.log(" IN VIEW DETAIL ", route.name);
  const [tvShowData, setTVShowData] = useState<TVShowDetails>(undefined);
  const [isInSavedTVShows, setIsInSavedTVShows] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const state = useOState();
  const actions = useOActions();
  const { saveTVShow, deleteTVShow, apiGetTVShowDetails } = actions.oSaved;
  const getTempTVShowDetails = async (tvShowId: number) => {
    const tvShowTemp = await apiGetTVShowDetails(tvShowId);
    return tvShowTemp.data;
  };

  // Not sure if this is best way to do this
  // Getting saved data for tvShowId because need to check in useEffect
  // to see if posterURL has changed so that we get new data passed down
  const savedShowData = state.oSaved.getTVShowDetails(route.params?.tvShowId);
  useEffect(() => {
    const mergeShowDetails = async (savedDetails = {}) => {
      let tvShowDetails = await getTempTVShowDetails(route.params?.tvShowId);
      setTVShowData({ ...tvShowDetails, ...savedDetails });
    };

    setIsInSavedTVShows(state.oSaved.isTVShowSaved(route.params?.tvShowId));

    if (route.params?.tvShowId) {
      let tvShowSavedData = savedShowData; //state.oSaved.getTVShowDetails(route.params?.tvShowId);
      mergeShowDetails(tvShowSavedData);
    }
  }, [route.params?.tvShowId, route.params?.notSaved, savedShowData?.posterURL]);

  //---- Set navigation options for detail screen -----
  // 1. Set the title to the current movie title
  // 2. Add a + icon for movies that are have not yet been added to list.
  // 3. If the movie is in the list, show a delete icon INSTEAD of the plus.
  //TODO (could be better looking delete icon)

  React.useEffect(() => {
    if (!tvShowData) {
      return;
    }
    navigation.setOptions({
      title: tvShowData.name,
      headerTintColor: colors.darkText,
      headerStyle: {
        backgroundColor: colors.navHeaderColor,
      },
      headerRight: () => {
        if (isLoading) {
          return <ActivityIndicator style={{ marginRight: 20 }} />;
        }
        if (!isInSavedTVShows) {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={async () => {
                setIsLoading(true);
                await saveTVShow(tvShowData.id);
                navigation.navigate(route.name, {
                  tvShowId: tvShowData.id,
                  notSaved: false,
                });
                setIsLoading(false);
                // navigation.goBack();
              }}
            >
              <AddIcon size={35} />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={async () => {
                setIsLoading(true);
                await deleteTVShow(tvShowData.id);
                setIsLoading(false);
                navigation.goBack();
              }}
            >
              <DeleteIcon size={25} />
            </TouchableOpacity>
          );
        }
      },
    });
  }, [tvShowData, isInSavedTVShows, isLoading]);

  // No movieId and no movie passed via params, then just return null
  //TODO: probably need a better "message", but we really should only hit this
  //TODO: when deleteing movie from the right header icon
  if (!tvShowData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Image
        style={{
          position: "absolute",
          width,
          height,
          resizeMode: "cover",
          opacity: 0.1,
        }}
        source={{
          uri: tvShowData?.posterURL || null,
        }}
      />
      <ScrollView>
        <ViewTVShowDetails tvShow={tvShowData} isInSavedTVShows={isInSavedTVShows} />
      </ScrollView>
    </View>
  );
};

//`imdb:///find?q=${movie.title}`
export default ViewDetails;
