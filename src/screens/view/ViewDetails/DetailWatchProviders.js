import * as React from "react";
import { View, ActivityIndicator, FlatList, Animated, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import _ from "lodash";

import { Button } from "../../../components/common/Buttons";
import { colors } from "../../../globalStyles";
import { useWatchProviderData, WatchProvidersType } from "../../../hooks/useWatchProviderData";
import PosterImage from "../../../components/common/PosterImage";

const SMALL_SPACE_BETWEEN = 10;
const IMAGE_WIDTH = 50;
const LARGE_SPACE_BETWEEN = 40;

const DetailWatchProviders = ({ tvShowId }) => {
  const scrollRef = React.useRef();
  const [watchProviders, watchProvidersIsLoading] = useWatchProviderData(tvShowId);
  // Both of these should be calculated in useWatchProviderData hook
  const [flatProviders, setFlatProviders] = React.useState([]);
  const [titles, setTitles] = React.useState([]);
  //------
  const [scrollIndex, setScrollIndex] = React.useState(0);
  const scrollOffset = React.useRef(new Animated.Value(0)).current;

  // Everytime we load the recommendations,
  React.useEffect(() => {
    if (scrollRef.current && !watchProvidersIsLoading) {
      scrollRef.current.scrollTo({ x: scrollIndex, animated: false });
      setScrollIndex(0);
    }
  }, [watchProvidersIsLoading]);
  // Reset scrollIndex to zero when a new tvShowId is passed
  React.useEffect(() => {
    setScrollIndex(0);
  }, [tvShowId]);

  React.useEffect(() => {
    if (!watchProvidersIsLoading) {
      // For flatlist testing convert object to array
      // [ { type: 'stream', 'buy', or 'rent', provider, providerId }]
      // adding a key field in so flatlist will pick it up and use.
      let prevTypeCount = 0; // Used so we can calculate spacing between types.
      const reducedProviders = _.reduce(
        watchProviders,
        (final, item, key) => {
          if (Array.isArray(item)) {
            prevTypeCount += item.length;
            item.map((row, idx, arr) =>
              final.push({
                ["key"]: `${key}-${row.providerId}`,
                type: key, // Stream, Buy or Rent
                typeIndexCount: prevTypeCount,
                typeCount: arr.length,
                ...row,
              })
            );
          }
          return final;
        },
        []
      );

      // Create an array of objects to tell us where the titles show up on the flatlist
      // let previousTypeCount = 0;
      const calcStartPos = (typeCount = 0, index) => {
        // typeCount is the number of Providers in the previous Group
        // if it is first group, then typeCount should be 0
        // if index ===0 then at first group
        let largeSpace = LARGE_SPACE_BETWEEN - 10;
        if (index === 0) {
          largeSpace = 0;
        }
        return typeCount * (IMAGE_WIDTH + SMALL_SPACE_BETWEEN) + largeSpace;
      };
      const calcEndPos = (typeCount) =>
        typeCount * (IMAGE_WIDTH + SMALL_SPACE_BETWEEN) + LARGE_SPACE_BETWEEN - 2;

      let typeTitles = [];
      let prevStartPos = 0;
      let prevEndPos = 0;
      reducedProviders.forEach((provider, index) => {
        if (provider.type === reducedProviders[index - 1]?.type) {
          return;
        }
        const startPos = calcStartPos(reducedProviders[index - 1]?.typeCount, index);
        typeTitles.push({
          type: _.capitalize(provider.type),
          startPosition: prevEndPos,
          // startPosition: startPos + prevStartPos,
          endPosition: calcEndPos(provider.typeCount) + startPos,
          typeCount: provider.typeCount,
          nextType: index === 0 ? "Buy" : index === 1 ? "Rent" : "Stream",
        });
        prevStartPos = startPos;
        prevEndPos = calcEndPos(provider.typeCount) + startPos;
      });

      setTitles(typeTitles);
      setFlatProviders(reducedProviders);
    }
  }, [watchProviders]);

  if (watchProvidersIsLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff85",
          borderTopColor: "#ccc",
          borderBottomColor: "#ccc",
          borderBottomWidth: 2,
          borderTopWidth: 2,
          marginVertical: 10,
          paddingVertical: 15,
          height: 200,
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  //! watchProviders is an Object, need to deal with it differently
  if (watchProviders.length === 0 && !watchProvidersIsLoading) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={{ fontWeight: "normal", fontSize: 20 }}>No Watch Providers Found</Text>
      </View>
    );
  }
  return (
    <View style={{ marginLeft: 0 }}>
      {flatProviders.length > 0 && (
        <View>
          <View
            style={{
              height: 30,
              marginBottom: 3,
              borderBottomColor: "#777",
              borderBottomWidth: 1,
              borderLeftColor: "#777",
              borderLeftWidth: 1,
            }}
          >
            {titles.map((typeTitle) => {
              let titleWidth =
                (typeTitle.typeCount === 1 ? 1.3 : typeTitle.typeCount) *
                (IMAGE_WIDTH + SMALL_SPACE_BETWEEN);
              const animatedWidth = Animated.subtract(
                titleWidth + typeTitle.startPosition,
                scrollOffset
              );

              const bgColor = {
                active: "#91c33c",
                inactive: "#91c33c55",
              };

              return (
                <Animated.View
                  key={typeTitle.type}
                  style={{
                    position: "absolute",
                    backgroundColor: scrollOffset.interpolate({
                      // inputRange: [typeTitle.endPosition - 180, typeTitle.endPosition - 40],
                      inputRange: [typeTitle.startPosition - 60, typeTitle.startPosition],
                      outputRange: [bgColor.inactive, bgColor.active], //bgColor[typeTitle.nextType]],
                      extrapolate: "clamp",
                    }),
                    width: animatedWidth, //typeTitle.endPosition - typeTitle.startPosition - 40,
                    borderRightWidth: 1,
                    borderLeftWidth: 1,
                    borderRightColor: "#777",
                    borderLeftColor: "#777",
                    height: "100%",
                    paddingTop: 4,
                    paddingLeft: 10,
                    opacity: scrollOffset.interpolate({
                      inputRange: [typeTitle.endPosition - 80, typeTitle.endPosition - 40],
                      outputRange: [1, 0],
                    }),
                    transform: [
                      {
                        translateX: scrollOffset.interpolate({
                          inputRange: [0, typeTitle.startPosition],
                          outputRange: [typeTitle.startPosition, 0],
                          extrapolate: "clamp",
                        }),
                      },
                    ],
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                    }}
                  >
                    {typeTitle.type}
                  </Text>
                </Animated.View>
              );
            })}
          </View>
          <FlatList
            data={flatProviders}
            style={{ paddingLeft: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={5}
            onScroll={(e) => {
              scrollOffset.setValue(
                e.nativeEvent.contentOffset.x < 0 ? 0 : e.nativeEvent.contentOffset.x
              );
            }}
            renderItem={({ item, index }) => {
              // console.log(`${item.type}-${item.providerId}`);
              let newProviderMargin =
                item.typeIndexCount - 1 === index ? LARGE_SPACE_BETWEEN : SMALL_SPACE_BETWEEN;
              return (
                <View style={{ marginRight: newProviderMargin }}>
                  <PosterImage
                    uri={item.logoURL}
                    placeholderText={item.provider}
                    posterWidth={IMAGE_WIDTH}
                    posterHeight={IMAGE_WIDTH}
                    style={{ borderRadius: 5 }}
                  />
                </View>
              );
            }}
          />
          <View
            style={{
              marginTop: 10,
              paddingTop: 10,
              borderTopWidth: 1,
              borderColor: colors.commonBorder,
              alignItems: "center",
            }}
          >
            <Button
              title="Just Watch"
              width="50%"
              bgOpacity="ff"
              bgColor={colors.primary}
              small
              // width={150}
              wrapperStyle={{
                marginLeft: 10,
                borderRadius: 10,
                paddingLeft: 15,
                paddingRight: 15,
              }}
              color="#fff"
              onPress={async () => {
                WebBrowser.openBrowserAsync(watchProviders.justWatchLink);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default DetailWatchProviders;
