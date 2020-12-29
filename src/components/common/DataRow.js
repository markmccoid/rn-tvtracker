import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts } from "../../globalStyles";

const DataRow = ({ label, value, size = "s" }) => {
  // If value is undefined, then return null
  if (!value) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label(size)}>{label}</Text>
      <Text style={styles.value(size)}>{value}</Text>
    </View>
  );
};

export default DataRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  label: (size) => ({
    fontSize: fonts[size],
    fontWeight: "bold",
    marginRight: 5,
  }),
  value: (size) => ({
    fontSize: fonts[size],
    marginRight: 5,
  }),
});
