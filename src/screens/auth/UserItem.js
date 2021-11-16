import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { DeleteIcon } from "../../components/common/Icons";

const { width } = Dimensions.get("screen");
const UserItem = ({ user, itemHeight, onDeleteUser, onSelectUser }) => {
  return (
    <View style={[styles.userContainer, { height: itemHeight }]}>
      <Text>{user.username}</Text>
      <TouchableOpacity onPress={() => onDeleteUser(user.uid)}>
        <DeleteIcon size={20} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  userContainer: {
    flexDirection: "row",

    padding: 5,
    // borderWidth: 1,
    // borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    // width: width / 1.5,

    // margin: 2,
  },
});
export default UserItem;
