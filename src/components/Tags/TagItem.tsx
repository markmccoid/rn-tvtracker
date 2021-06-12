import React from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { colors } from "../../globalStyles";
import { EditIcon, DeleteIcon } from "../common/Icons";

type TagProps = {
  id: string;
  name: string;
  height: number;
  onDeleteTag: (tagId: string) => void;
  onEditTag: (tagId: string, tagName: string) => void;
};

const confirmDelete = (fn) =>
  Alert.alert("Confirm Delete", "Delete Tag?", [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    { text: "OK", onPress: () => fn() },
  ]);

export default function TagItem({ id, name, height, onDeleteTag, onEditTag }: TagProps) {
  return (
    <View style={[styles.itemWrapper, { height: height - 4 }]}>
      <Text style={styles.tagNameText}>{name}</Text>

      <View style={styles.iconsWrapper}>
        <Pressable
          onPress={() => onEditTag(id, name)}
          style={({ pressed }) => ({
            transform: [
              { scale: pressed ? 0.99 : 1 },
              { translateX: pressed ? 1.5 : 0 },
              { translateY: pressed ? 1.5 : 0 },
            ],
          })}
        >
          <EditIcon size={25} style={styles.icon} />
        </Pressable>
        <Pressable
          onPress={() => {
            confirmDelete(() => onDeleteTag(id));
          }}
          style={({ pressed }) => ({
            transform: [
              { scale: pressed ? 0.99 : 1 },
              { translateX: pressed ? 1.5 : 0 },
              { translateY: pressed ? 1.5 : 0 },
            ],
          })}
        >
          <DeleteIcon size={25} color={colors.excludeRed} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: colors.listBorder,
    borderRadius: 10,
    backgroundColor: "white",
    marginRight: 5,
    marginLeft: 2,
    marginVertical: 2,
  },
  tagNameText: {
    fontSize: 18,
  },
  iconsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
  icon: {
    paddingHorizontal: 8,
  },
});
