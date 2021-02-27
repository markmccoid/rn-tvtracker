import * as React from "react";
import { View, StyleSheet, Linking, Pressable, Image, Text, Dimensions } from "react-native";
import PosterImage from "../common/PosterImage";

const { width, height } = Dimensions.get("window");
const WatchProviderList = ({ watchProviders }) => {
  return (
    <View>
      <Pressable
        onPress={() => {
          Linking.openURL(watchProviders.justWatchLink);
        }}
      >
        <Image
          source={require("../../../assets/justwatch.png")}
          style={{ width: 30, height: 30 }}
        />
      </Pressable>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#f3a4a7",
            borderWidth: 1,
            borderColor: "#aaa",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            width: 30,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              width: 100,
              transform: [{ rotate: "90deg" }],
            }}
          >
            Stream
          </Text>
        </View>
        <View
          style={{
            backgroundColor: "#f3a4a7",
            borderWidth: 1,
            borderColor: "#aaa",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            width: 50,
            height: 50,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            S
          </Text>
        </View>
        <View style={styles.providerContainer}>
          {watchProviders.stream.map((item) => {
            return (
              <View key={`stream-${item.providerId}`} style={{ margin: 5 }}>
                <PosterImage
                  uri={item.logoURL}
                  placeholderText={item.provider}
                  posterWidth={50}
                  posterHeight={50}
                  style={{ borderRadius: 5 }}
                />
              </View>
            );
          })}
        </View>

        <View
          style={{
            padding: 5,
            flexDirection: "column",
            backgroundColor: "#f3a4a7",
            borderWidth: 1,
            borderColor: "#aaa",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "700" }}>R</Text>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>e</Text>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>n</Text>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>t</Text>
        </View>
        <View style={styles.providerContainer}>
          {watchProviders.rent.map((item) => {
            return (
              <View key={`rent-${item.providerId}`} style={{ margin: 5 }}>
                <PosterImage
                  uri={item.logoURL}
                  placeholderText={item.provider}
                  posterWidth={50}
                  posterHeight={50}
                  style={{ borderRadius: 5 }}
                />
              </View>
            );
          })}
        </View>
        <View
          style={{
            padding: 3,
            backgroundColor: "#f3a4a7",
            borderWidth: 1,
            borderColor: "#aaa",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
            width: 50,
            height: 50,
          }}
        >
          <Text style={{ fontSize: 18 }}>Buy</Text>
        </View>
        <View style={styles.providerContainer}>
          {watchProviders.buy.map((item) => {
            return (
              <View key={`buy-${item.providerId}`} style={{ margin: 5 }}>
                <PosterImage
                  uri={item.logoURL}
                  placeholderText={item.provider}
                  posterWidth={50}
                  posterHeight={50}
                  style={{ borderRadius: 5 }}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  providerContainer: { flexDirection: "row", flexWrap: "wrap", width, margin: 5 },
});
export default WatchProviderList;
