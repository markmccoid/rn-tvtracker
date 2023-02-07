import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { MaterialIcons } from "@expo/vector-icons";
import { CheckIcon, AddIcon } from "../common/Icons";
//@types
import {
  DetailsScreenNavigation,
  DetailsSearchScreenNavigation,
} from "../../screens/view/viewTypes";
// import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { rawTVGetExternalIds } from "@markmccoid/tmdb_api";

const { width, height } = Dimensions.get("window");
const imageWidth = width / 3 - 20;
const imageHeight = (width / 3 - 20) / 0.67;

// Individual movie "boxes" shown on search result screen
const SearchResultItem = ({
  tvShow,
  saveTVShow,
  deleteTVShow,
  setOnDetailsPage,
  navigateToScreen,
}) => {
  const { popToTop, goBack, navigate, push } = useNavigation<DetailsSearchScreenNavigation>();
  // If tv show exists in library, then we display it in details page differently
  // The DetailsFromSearch screen is in the SearchStack.js file, but points to
  // the same component as the the details screen from the ViewStack.js screen.
  // Both point to ViewDetails.js
  // The navigateToScreen prop will be either "DetailsFromSearch" from the SearchStack.js
  // OR "Details" from the ViewStack.js.  This is determined if the starting point was "My Movies"(ViewStack)
  // OR "Add tvShow"(SearchStack)
  // NOTE: using push instead of navigate so that each screen is pushed onto stack
  const navigateToDetails = async () => {
    if (navigateToScreen === "MODAL") {
      try {
        const externalIds = await rawTVGetExternalIds(tvShow.id);
        const imdbId = externalIds.data.imdb_id;
        if (!imdbId) throw new Error("Null imdb id");

        Linking.openURL(`imdb:///title/${imdbId}`).catch((err) => {
          Linking.openURL("https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525");
        });
      } catch (err) {
        Alert.alert("Error", "Unable to find Link for IMDB");
      }
    } else {
      setOnDetailsPage(true);
      push(`${navigateToScreen}Modal`, {
        screen: navigateToScreen,
        params: { tvShowId: tvShow.id, notSaved: !tvShow.existsInSaved },
      });
    }
  };
  // If navigateToScreen == 'MODAL', then it is coming from Episode Details modal screen
  // and I don't want to be able to dig any deeper, so disable
  return (
    <View style={styles.container}>
      <TouchableOpacity
        // disabled={navigateToScreen === "MODAL"}
        onPress={navigateToDetails}
        activeOpacity={0.8}
      >
        {tvShow?.posterURL ? (
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 0.5,
            }}
          >
            <Image
              source={{ url: tvShow?.posterURL }}
              style={styles.image}
              PlaceholderContent={<MaterialIcons name="broken-image" size={64} />}
            />
          </View>
        ) : (
          <View style={[styles.image, styles.imageBackup]}>
            <Text style={styles.imageBackupText}>{tvShow.name}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        style={{ flex: 1 }}
        onPress={() =>
          tvShow.existsInSaved ? deleteTVShow(tvShow.id) : saveTVShow(tvShow.id)
        }
      >
        <View
          style={[
            { flex: 1, alignItems: "center", justifyContent: "center" },
            tvShow.existsInSaved && styles.exists,
          ]}
        >
          <Text numberOfLines={1} style={styles.title}>
            {tvShow.name}
          </Text>
        </View>

        <View style={[styles.addMovieButton, tvShow.existsInSaved && styles.exists]}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {tvShow.existsInSaved ? <CheckIcon size={20} /> : <AddIcon size={20} />}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    width: imageWidth + 1,
    height: imageHeight + 25,
    margin: 5,
    borderColor: "black",
    borderWidth: 0.5,
    backgroundColor: "white",
  },
  image: {
    width: imageWidth,
    height: imageHeight,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  title: {
    fontSize: 14,
    paddingHorizontal: 5,
    overflow: "hidden",
  },
  addMovieButton: {
    width: imageWidth / 4,
    height: imageHeight / 7.5,
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderColor: "black",
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "white",
    position: "absolute",
    bottom: 23,
    left: imageWidth / 2 - imageWidth / 4 / 2,
  },
  exists: {
    backgroundColor: "lightgreen",
  },
  genreContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  genre: {
    padding: 2,
    marginHorizontal: 5,
    borderColor: "black",
    borderWidth: 1,
    fontSize: 12,
    backgroundColor: "#34495e44",
  },
  dateContainer: {
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  imageBackup: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 0.5,
  },
  imageBackupText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  existsInSaved: {
    borderColor: "green",
    backgroundColor: "lightgreen",
    borderWidth: 2,
  },
});

export default React.memo(SearchResultItem);
