import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";

import { useDimensions } from "@react-native-community/hooks";
import { LessIcon, MoreIcon } from "../../../components/common/Icons";
import SetUserRating from "./SetUserRating";
import { useOActions, useOState } from "../../../store/overmind";
import UserRating from "../../../components/UserRating/UserRating";

const DetailMainInfo = ({ movie, isInSavedMovies }) => {
  const [overviewHeight, setOverviewHeight] = useState(225);
  const [showUserRating, setShowUserRating] = useState(false);
  const actions = useOActions();
  const state = useOState();
  const { updateUserRatingToMovie } = actions.oSaved;
  const { getMovieUserRating } = state.oSaved;
  // const [movieUserRating, setUserRating] = useState(0);
  // maybe needs to be in useEffect??? or memoized
  const movieUserRating = getMovieUserRating(movie.id);
  // useEffect(() => {
  //   console.log("in useffect", movie.id, movieUserRating, getMovieUserRating(movie.id));
  //   setUserRating(getMovieUserRating(movie.id));
  // }, [movie.id, getMovieUserRating(movie.id)]);
  const { width, height } = useDimensions().window;
  // If poster doesn't exist use the placeholder image
  let movieURL = movie.posterURL ? { uri: movie.posterURL } : require("./placeholder.png");
  // Get data to use from movie object
  const { overview = "", releaseDate = "", imdbURL = "", runtime = "" } = movie;

  const toggleOverview = () => setOverviewHeight((curr) => (curr ? undefined : 225));
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
          // backgroundColor: "#3b544199",
        }}
      >
        {isInSavedMovies && (
          <View
            style={{
              position: "absolute",
              left: 35,
              bottom: -5,
              zIndex: 100,
              // marginTop: 5,
              // height: showUserRating ? 50 : 30,
              //width: showUserRating ? width : undefined,
            }}
          >
            <SetUserRating
              movieId={movie.id}
              setShowUserRating={setShowUserRating}
              userRating={movieUserRating}
              updateUserRating={(userRating) =>
                updateUserRatingToMovie({ movieId: movie.id, userRating })
              }
            />
            {/* {showUserRating && <UserRating movieId={movie.id} />} */}
            <Text>{showUserRating}</Text>
          </View>
        )}
        <View>
          <View style={[styles.posterWrapper, styles.posterImage]}>
            <Image style={styles.posterImage} source={movieURL} resizeMode="contain" />
          </View>
          {/*---------------------
          ------------------------*/}
        </View>
        <View style={{ flex: 1, paddingHorizontal: 5, height: overviewHeight }}>
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
                // backgroundColor: "#ffffff77",
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
      <View>
        <View style={styles.textRow}>
          <Text style={styles.textRowLabel}>Released:</Text>
          <Text style={{ fontSize: 18 }}>{releaseDate.formatted}</Text>
        </View>
        {runtime ? (
          <View style={styles.textRow}>
            <Text style={styles.textRowLabel}>Length: </Text>
            <Text style={{ fontSize: 18 }}>{runtime} minutes</Text>
          </View>
        ) : null}
        <View style={[styles.textRow, { flexWrap: "wrap" }]}>
          <Text style={styles.textRowLabel}>Genre(s): </Text>
          {movie.genres.map((genre, idx) => (
            <Text key={genre} style={{ fontSize: 18 }}>{`${
              idx === 0 ? "" : ", "
            }${genre}`}</Text>
          ))}
        </View>
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
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 2.5, height: 3 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 1,
    // marginLeft: 5,
    marginRight: 5,
    // marginTop: 10,
  },
  posterImage: {
    width: 130,
    height: 200,
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
export default DetailMainInfo;
