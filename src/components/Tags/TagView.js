import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Button } from "../common/Buttons";
import { Feather } from "@expo/vector-icons";
import { useDimensions } from "@react-native-community/hooks";
import { useOvermind } from "../../store/overmind";

import TagRowEdit from "./TagRowEdit";

const TagView = () => {
  const { state, actions } = useOvermind();
  const { tagData } = state.oSaved;
  const { deleteTag } = actions.oSaved;
  const [isEditing, setIsEditing] = useState(undefined);
  let { width, height } = useDimensions().window;
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
    <View
      style={{
        width: Dimensions.get("window").width - 20,
        borderColor: "black",
        marginLeft: 10,
        borderWidth: 1,
      }}
    >
      {/* <FlatList
        keyExtractor={item => item.tagId}
        data={tagData}
        renderItem={renderTag}
      /> */}

      <SwipeListView
        useFlatList
        data={tagData}
        keyExtractor={(item) => item.tagId}
        renderItem={(rowData, rowMap) => {
          return (
            <>
              <View style={styles.mainSwipe}>
                {isEditing === rowData.item.tagId ? (
                  <TagRowEdit
                    currTagValue={rowData.item.tagName}
                    tagId={rowData.item.tagId}
                    setIsEditing={setIsEditing}
                  />
                ) : (
                  <Text style={{ fontSize: 18, paddingLeft: 20 }}>
                    {rowData.item.tagName}
                  </Text>
                )}
              </View>
            </>
          );
        }}
        renderHiddenItem={(rowData, rowMap) => {
          return (
            <>
              <View style={[styles.backRightBtn, styles.backRightBtnLeft]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(rowData.item.tagId);
                    rowMap[rowData.item.tagId].closeRow();
                  }}
                >
                  <Feather name="edit" size={30} />
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
          }, 3000);
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
  },
  tag: {
    flex: 4,
  },
  tagButton: {
    flex: 1,
  },
  mainSwipe: {
    backgroundColor: "#ccc",
    borderColor: "black",
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center",
    position: "relative",
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
    borderBottomWidth: 1,
    borderTopWidth: 1,
  },
  backRightBtnLeft: {
    backgroundColor: "lightblue",
    left: 0,
    borderRightWidth: 1,
  },
  deleteRightBtn: {
    backgroundColor: "#d11a2a",
    right: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});

export default TagView;
