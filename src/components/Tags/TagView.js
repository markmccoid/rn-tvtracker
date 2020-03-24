import React, { useState } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Text, TextInput, Button, ListItem } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import { useOvermind } from "../../store/overmind";

const TagView = () => {
  const { state, actions } = useOvermind();
  const { tagData } = state.oSaved;
  const { deleteTag } = actions.oSaved;
  const [isEditing, setIsEditing] = useState(false);
  // const renderTag = ({ item }) => {
  //   return (
  //     <View style={styles.tagWrapper}>
  //       <ListItem
  //         style={styles.tag}
  //         key={item.id}
  //         title={item.tagName}
  //         bottomDivider
  //         chevron
  //       />
  //       <View style={styles.tagButton}>
  //         <Button title="Delete" onPress={() => deleteTag(item.tagId)} />
  //       </View>
  //     </View>
  //   );
  // };
  return (
    <View>
      {/* <FlatList
        keyExtractor={item => item.tagId}
        data={tagData}
        renderItem={renderTag}
      /> */}

      <SwipeListView
        useFlatList
        data={tagData}
        keyExtractor={item => item.tagId}
        renderItem={(rowData, rowMap) => {
          return (
            <View style={styles.mainSwipe}>
              <Text style={{ fontSize: 18, marginLeft: 20 }}>
                {rowData.item.tagName}
              </Text>
            </View>
          );
        }}
        renderHiddenItem={(rowData, rowMap) => {
          return (
            <>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(true);
                    rowMap[rowData.item.tagId].closeRow();
                  }}
                >
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.backRightBtn, styles.deleteRightBtn]}>
                <TouchableOpacity
                  onPress={() => {
                    deleteTag(rowData.item.tagId);
                  }}
                >
                  <Feather name="trash-2" size={30} />
                </TouchableOpacity>
              </View>
            </>
          );
        }}
        leftOpenValue={75}
        rightOpenValue={-75}
        onRowOpen={(rowKey, rowMap) => {
          setTimeout(() => {
            if (rowMap[rowKey]) {
              rowMap[rowKey].closeRow();
            }
          }, 2000);
        }}
      />
    </View>
  );
};

let styles = StyleSheet.create({
  tagWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    marginRight: 10
  },
  tag: {
    flex: 4
  },
  tagButton: {
    flex: 1
  },
  mainSwipe: {
    backgroundColor: "#ccc",
    borderColor: "black",
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center"
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    height: 40,
    borderColor: "black",
    borderBottomWidth: 1
  },
  backRightBtnLeft: {
    backgroundColor: "lightblue",
    left: 0,
    borderRightWidth: 1
  },
  deleteRightBtn: {
    backgroundColor: "#d11a2a",
    right: 0
  }
});

export default TagView;
