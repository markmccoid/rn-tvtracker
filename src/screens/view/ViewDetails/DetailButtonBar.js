import React from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { colors, styleHelpers } from "../../../globalStyles";
import { useNavigation, useRoute } from "@react-navigation/native";
import PressableButton from "../../../components/common/PressableButton";

const { width } = Dimensions.get("window");

const DetailButtonBar = ({ tvShow }) => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.wrapper}>
      <View style={[styles.buttonRow, { marginBottom: 8 }]}>
        <PressableButton
          type="primary"
          onPress={() => {
            navigation.navigate(`${route.name}Seasons`, {
              tvShowId: tvShow.id,
              seasonNumbers: tvShow?.seasons.map((show) => show.seasonNumber),
              logo: { showName: tvShow.name },
            });
          }}
        >
          <Text style={{ fontWeight: "600", color: colors.buttonTextDark }}>{`View ${
            tvShow?.seasons.filter((s) => s.seasonNumber !== 0).length
          } Seasons`}</Text>
        </PressableButton>

        <PressableButton
          style={[styles.button, { backgroundColor: colors.imdbYellow }]}
          onPress={() => {
            const imdbId = imdbId;
            const imdbLink = `imdb:///title/${tvShow.imdbId}/episodes`;

            Linking.openURL(imdbLink).catch((err) => {
              Linking.openURL(
                "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
              );
            });
          }}
        >
          <Text style={{ fontWeight: "600", color: colors.buttonTextDark }}>IMDB Seasons</Text>
        </PressableButton>
      </View>

      <View style={styles.buttonRow}>
        <PressableButton
          style={[
            styles.button,
            {
              backgroundColor: "#4285F4",
              flexDirection: "row",
              justifyContent: "flex-start",
              padding: 0,
            },
          ]}
          onPress={async () => {
            let webURL = `https://google.com/search?query=${tvShow.name} tv show`;
            webURL = webURL.replace(/\s+/g, "%20");
            await WebBrowser.openBrowserAsync(webURL);
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              padding: 2,
              marginRight: 15,
            }}
          >
            <Image
              source={require("../../../../assets/GoogleLogoSmall.png")}
              style={{ width: 18, height: 18 }}
            />
          </View>
          <Text style={{ fontWeight: "600", color: "#212121" }}>Google It</Text>
        </PressableButton>

        <PressableButton
          style={[styles.button, { backgroundColor: colors.imdbYellow }]}
          onPress={() =>
            Linking.openURL(`imdb:///title/${tvShow.imdbId}`).catch((err) => {
              Linking.openURL(
                "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
              );
            })
          }
        >
          <Text style={{ fontWeight: "600", color: "#212121" }}>Open in IMDB</Text>
        </PressableButton>
      </View>
    </View>
  );
};

export default DetailButtonBar;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginBottom: 5,
    backgroundColor: "#ffffff85",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  button: {
    // borderWidth: 1,
    width: width / 2.5,
    // padding: 5,
    // backgroundColor: colors.buttonPrimary,
    // ...styleHelpers.buttonShadow,
    alignItems: "center",
    justifyContent: "center",
  },
});
