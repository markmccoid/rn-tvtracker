import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";

import PosterImage from "../../../components/common/PosterImage";
import { useOActions } from "../../../store/overmind";
import { getPersonDetails, movieGetPersonCredits } from "@markmccoid/tmdb_api";
import { Button } from "../../../components/common/Buttons";
import { colors } from "../../../globalStyles";
import DataRow from "../../../components/common/DataRow";
import SearchResultItem from "../../../components/search/SearchResultItem";
import { useGetPersonMovies } from "../../../hooks/useGetPersonMovies";

import { LessIcon, MoreIcon } from "../../../components/common/Icons";

const { width, height } = Dimensions.get("window");
const PICTURE_WIDTH = (width - 5) / 3;
const MARGIN = 5;
const PICTURE_HEIGHT = PICTURE_WIDTH * (9 / 6);

//--Main Component
const DetailPerson = ({ navigation, route }) => {
  const { personId, fromRouteName } = route.params;
  const [personInfo, setPersonInfo] = useState(undefined);
  const [showBio, setShowBio] = useState(false);
  const [personMovieData, isLoading] = useGetPersonMovies(personId);
  const actions = useOActions();
  const { saveTVShow, deleteMovie } = actions.oSaved;

  const toggleShowBio = () => setShowBio((prevState) => !prevState);
  //loads personDetails and movies that person was in(personCredits)
  useEffect(() => {
    const getPersonInfo = async (personId) => {
      const personDetails = await getPersonDetails(personId);
      //const personCredits = await movieGetPersonCredits(personId);
      // also get person movies?
      setPersonInfo(personDetails.data);
    };

    getPersonInfo(personId);
  }, [personId]);

  //Set the navigation title to the persons name
  useEffect(() => {
    navigation.setOptions({
      title: personInfo?.name,
    });
  }, [personInfo]);

  if (!personInfo) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <PosterImage
            style={styles.profilePic}
            uri={personInfo?.profileImage}
            posterHeight={PICTURE_HEIGHT}
            posterWidth={PICTURE_WIDTH}
          />
          {/* <Image style={styles.profilePic} source={returnImageURI(personInfo?.profileImage)} /> */}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginTop: 10,
            marginHorizontal: 5,
            marginBottom: 5,
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <View>
            <DataRow label="Born:" value={personInfo?.birthday?.formatted} size="s" />
            <DataRow label="Died:" value={personInfo?.deathDay?.formatted} size="s" />
            <DataRow label="Birthplace:" value={personInfo?.placeOfBirth?.trim()} size="s" />
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Button
              onPress={() =>
                Linking.openURL(`imdb:///name/${personInfo.imdbId}`).catch((err) => {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                  );
                })
              }
              title="Open in IMDB"
              bgOpacity="ff"
              bgColor={colors.primary}
              small
              width={width / 2}
              wrapperStyle={{
                borderRadius: 0,
              }}
              color="#fff"
              noBorder
            />
          </View>
        </View>
      </View>

      <View style={{}}>
        <Text style={styles.bio} numberOfLines={showBio ? 100 : 5}>
          {personInfo.biography}
        </Text>
        <View
          style={{ alignItems: "flex-end", marginRight: 15, marginBottom: 15, marginTop: -5 }}
        >
          <TouchableOpacity onPress={toggleShowBio}>
            {showBio ? (
              <LessIcon size={20} color="black" />
            ) : (
              <MoreIcon size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {isLoading ? (
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 25 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          personMovieData.map((item, idx) => {
            return (
              <SearchResultItem
                key={item.id + idx.toString()}
                movie={item}
                saveTVShow={saveTVShow}
                deleteMovie={deleteMovie}
                setOnDetailsPage={() => {}}
                navigateToScreen={fromRouteName}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
// profile image is a 6 x 9 ratio
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  profilePic: {
    width: PICTURE_WIDTH,
    height: PICTURE_HEIGHT,
    margin: MARGIN,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  bio: {
    padding: 10,
    fontSize: 16,
  },
});

export default DetailPerson;
