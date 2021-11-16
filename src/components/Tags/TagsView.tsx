import * as React from "react";
import { View, StyleProp, TextStyle, Dimensions } from "react-native";
import { useOState, useOActions } from "../../store/overmind";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

import { MaterialIcons } from "@expo/vector-icons";

import DragDropEntry, { sortArray } from "@markmccoid/react-native-drag-and-order";
import TagRowEditOverlay from "./TagRowEditOverlay";
import { colors } from "../../globalStyles";
import TagItem from "./TagItem";

type TagArray = {
  tagId: string;
  tagName: string;
};

const { width, height } = Dimensions.get("window");

export default function TagsView() {
  //Get tag data from Overmind
  const state = useOState();
  const actions = useOActions();

  const { tagData } = state.oSaved;
  const { updateTags, deleteTag } = actions.oSaved;

  const [isEditing, setIsEditing] = React.useState({
    isEditing: false,
    tagId: undefined,
    tagName: undefined,
  });

  const tabHeight = useBottomTabBarHeight();

  const onEditTag = (tagId, tagName) => {
    setIsEditing({ isEditing: true, tagId, tagName });
  };
  const onDeleteTag = (tagId) => {
    deleteTag(tagId);
  };
  return (
    <>
      <TagRowEditOverlay
        isVisible={isEditing.isEditing}
        currTagValue={isEditing.tagName}
        tagId={isEditing.tagId}
        setIsEditing={() =>
          setIsEditing({ isEditing: false, tagId: undefined, tagName: undefined })
        }
      />
      <DragDropEntry
        // scrollStyles={{ width: "100%", height: 500, borderWidth: 1, borderColor: "#aaa" }}
        // updatePositions={(positions) => console.log("Updating positions", positions)}
        updatePositions={(positions) =>
          updateTags(sortArray<TagArray>(positions, tagData, { idField: "tagId" }))
        }
        // getScrollFunctions={(functionObj) => setScrollFunctions(functionObj)}
        itemHeight={50}
        handlePosition="left"
        handle={MyHandle}
        enableDragIndicator
        dragIndicatorConfig={{ translateXDistance: 100 }}
      >
        {tagData.map((item, idx) => {
          return (
            <TagItem
              key={item.tagId}
              id={item.tagId}
              name={item.tagName}
              height={50}
              onDeleteTag={onDeleteTag}
              onEditTag={onEditTag}
            />
          );
        })}
      </DragDropEntry>
    </>
  );
}

type DragHandleIconProps = {
  size: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};
const DragHandleIcon = ({ size, color, style }: DragHandleIconProps) => {
  return <MaterialIcons name="drag-handle" size={size} color={color} style={style} />;
};

const MyHandle: React.FC = () => (
  <View
    style={{
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 10,
        backgroundColor: "white",
        marginLeft: 4,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 5,
      }}
    >
      <DragHandleIcon size={25} />
    </View>
  </View>
);
