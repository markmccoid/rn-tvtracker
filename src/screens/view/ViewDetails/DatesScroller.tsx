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
import Animated, {
  useSharedValue,
  useAnimatedRef,
  useDerivedValue,
  scrollTo,
  useAnimatedReaction,
} from "react-native-reanimated";
import { MotiView, AnimatePresence, useAnimationState } from "moti";

const ITEM_WIDTH = 110;

const DateFormatted = ({ dateLabel, dateText, bgColor }) => {
  return (
    <View
      style={[
        styles.singleDateContainer,
        { backgroundColor: `${bgColor}44`, borderColor: bgColor },
      ]}
    >
      <Text style={styles.dateLabel}>{dateLabel}</Text>
      <Text style={styles.dateText}>{dateText}</Text>
    </View>
  );
};
const DatesScroller = ({ lastAirDate, nextAirDate, firstAirDate }) => {
  const dateAnimation = useAnimationState({
    from: { opacity: 0, scale: 0.5 },
    to: { opacity: 1, scale: 1 },
  });

  return (
    <View style={styles.container}>
      <View style={{}}>
        <Animated.ScrollView
          horizontal
          // contentContainerStyle={{ width: ITEM_WIDTH * 3 }}
          showsHorizontalScrollIndicator={false}
          // pagingEnabled
          scrollEventThrottle={16}
          onScroll={(e) => {
            // console.log("onScroll label", labelBeingScrolled.value);
            // if (!labelBeingScrolled.value) {
            //   labelBeingScrolled.value = true;
            // }
            // scrollValue.value = e.nativeEvent.contentOffset.x;
          }}
        >
          <MotiView
            state={dateAnimation}
            transition={{
              // default settings for all style values
              type: "timing",
              duration: 350,
              delay: 0,
              // set a custom transition for scale
              scale: {
                type: "spring",
                delay: 100,
              },
            }}
          >
            <DateFormatted
              dateLabel="Next Episode"
              dateText={nextAirDate?.formatted}
              bgColor="#5657D6"
            />
          </MotiView>
          <MotiView
            state={dateAnimation}
            transition={{
              // default settings for all style values
              type: "timing",
              duration: 350,
              delay: 200,
              // set a custom transition for scale
              scale: {
                type: "spring",
                delay: 300,
              },
            }}
          >
            <DateFormatted
              dateLabel="Last Episode"
              dateText={lastAirDate?.formatted}
              bgColor="#59922D"
            />
          </MotiView>
          <MotiView
            state={dateAnimation}
            transition={{
              type: "timing",
              delay: 300,
              duration: 350,
              scale: {
                type: "spring",
                delay: 300,
              },
            }}
          >
            <DateFormatted
              dateLabel="First Episode"
              dateText={firstAirDate?.formatted}
              bgColor="#D6605A"
            />
          </MotiView>
        </Animated.ScrollView>
      </View>
      {/* <View style={{ width: ITEM_WIDTH, borderWidth: 1 }}>
        <Animated.ScrollView
          ref={scrollViewDatesRef}
          horizontal
          contentContainerStyle={{ width: ITEM_WIDTH * 3 }}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}
          onScroll={(e) => {
            if (labelBeingScrolled.value) {
              labelBeingScrolled.value = false;
            }
            scrollValue.value = e.nativeEvent.contentOffset.x;
          }}
        >
          <Text style={{ fontSize: 18, width: ITEM_WIDTH, paddingHorizontal: 5 }}>
            {firstAirDate?.formatted}
          </Text>
          <Text style={{ fontSize: 18, width: ITEM_WIDTH, paddingHorizontal: 5 }}>
            {lastAirDate?.formatted}
          </Text>
          <Text style={{ fontSize: 18, width: ITEM_WIDTH, paddingHorizontal: 5 }}>
            {nextAirDate?.formatted}
          </Text>
        </Animated.ScrollView>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  dateLabel: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 3,
    // width: ITEM_WIDTH,
  },
  dateText: {
    fontSize: 18,
    paddingHorizontal: 5,
  },
  singleDateContainer: {
    flexDirection: "row",
    borderWidth: 1,
    // borderColor: "#D6605A", //"#D6CD7A" "#5657D6"
    // backgroundColor: "#D6605A44", //"#D6CD7A44" "#5657D644"
    borderRadius: 5,
    marginRight: 10,
  },
  container: {
    flexDirection: "row",
    marginTop: 5,
  },
});

export default DatesScroller;
