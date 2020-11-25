import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const DataRow = ({ label, value, size }) => {
  // If value is undefined, then return null
  if (!value) {
    return null;
  }
  return (
    <View style={[styles.container, { flexDirection: "row" }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default DataRow;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    flexWrap: "wrap",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  value: {
    fontSize: 16,
    marginRight: 5,
  },
});
