import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Switch,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Overlay, Divider } from "react-native-elements";

import { colors } from "../../globalStyles";
import { FilterIcon, TagIcon, CloseIcon } from "../common/Icons";

const { width, height } = Dimensions.get("window");

const FilterTagsInfoOverlay = ({
  MessageComponent,
  genreOperator,
  setGenreOperator,
  isVisible,
  toggleVisibility,
}) => {
  return (
    <Overlay
      overlayStyle={styles.container}
      isVisible={isVisible}
      onBackdropPress={toggleVisibility}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.sectionWrapper,
            { flexDirection: "row", alignItems: "center", paddingLeft: 40 },
          ]}
        >
          <FilterIcon size={30} color={colors.includeGreen} />
          <Text style={[styles.title, { marginLeft: 15 }]}>Advanced Filter Info (Genres)</Text>

          <TouchableOpacity
            onPress={toggleVisibility}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
            }}
          >
            <View
              style={{
                paddingTop: 5,
                paddingRight: 5,
                paddingLeft: 10,
                paddingBottom: 10,
              }}
            >
              <CloseIcon size={20} />
            </View>
          </TouchableOpacity>
        </View>
        <Divider style={styles.dividerStyle} />
        <ScrollView style={{ height: height * 0.8 }}>
          <View style={styles.sectionWrapper}>
            <MessageComponent />
          </View>
          <Divider style={styles.dividerStyle} />

          <View style={styles.booleanContainer}>
            <View style={styles.tagTypeContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "600", marginRight: 5 }}>Genres</Text>
                <TagIcon color={colors.includeGreen} size={25} />
              </View>
              <View>
                <Text style={styles.describeText}>
                  Green (selected) genres will search for movies that INCLUDE those genres. The
                  green switch, when on, allows you to choose if the movies returned should
                  have
                  <Text style={[styles.describeText, { fontWeight: "600" }]}>{` ALL `}</Text>
                  of the selected genres. When the switch is off, the movies returned will have
                  <Text style={[styles.describeText, { fontWeight: "600" }]}>
                    {` ONE OR MORE `}
                  </Text>
                  of the selected genres. This is AND / OR boolean logic.
                </Text>
              </View>
              <View style={styles.switchContainer}>
                <Switch
                  trackColor={{ false: "", true: "green" }}
                  thumbColor={colors.includeGreen}
                  value={genreOperator === "AND" ? true : false}
                  onValueChange={(val) => setGenreOperator(val ? "AND" : "OR")}
                />
                <Text style={[styles.switchText, {}]}>
                  {genreOperator === "OR" ? "One Or More (OR)" : "All (AND)"}
                </Text>
              </View>
            </View>

            <Divider style={styles.dividerStyle} />
          </View>
        </ScrollView>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.95,
    height: height * 0.8,
    padding: 0,
    borderRadius: 10,
    borderColor: "#777",
    borderWidth: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
  },
  sectionWrapper: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    // borderBottomColor: "black",
    // borderBottomWidth: 1,
  },
  dividerStyle: {
    backgroundColor: "#999",
    height: 1,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.75,
    shadowRadius: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  decodeText: {
    fontSize: 18,
  },
  describeText: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonStyle: {
    width: 150,
  },
  booleanContainer: {
    flex: 1,
    // margin: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  tagTypeContainer: {
    flexDirection: "column",
    marginVertical: 15,
    marginHorizontal: 10,
  },
  switchContainer: {
    // flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
  },
  switchText: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});
export default FilterTagsInfoOverlay;
