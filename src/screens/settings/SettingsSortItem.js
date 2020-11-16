import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { ButtonGroup } from "react-native-elements";
import {
  DragHandleIcon,
  ExpandDownIcon,
  CollapseUpIcon,
  PowerIcon,
} from "../../components/common/Icons";

function getButtonState(active, direction) {
  const indexMap = { asc: 1, desc: 2 };
  if (!active) {
    return 0;
  }
  return indexMap[direction];
}
const SettingsSortItem = ({ title, direction, active, updateDefaultSortItem }) => {
  const [buttonIndex, setButtonIndex] = React.useState(() =>
    getButtonState(active, direction)
  );
  let disabledStyle = {};
  // const buttons = ["UP", "DOWN"];
  const buttons = [
    { element: () => <PowerIcon size={20} /> },
    { element: () => <CollapseUpIcon size={20} /> },
    { element: () => <ExpandDownIcon size={20} /> },
  ];
  if (buttonIndex === 0) {
    disabledStyle = { backgroundColor: "#ccc" };
  }

  React.useEffect(() => {
    setButtonIndex(getButtonState(active, direction));
  }, [direction, active]);

  const handleSortItemUpdate = (index) => {
    let payload = { title, active, direction };
    let directionMap = { 1: "asc", 2: "desc" };
    if (index === 0) {
      //not active
      payload = { ...payload, active: false };
    } else {
      payload = { ...payload, active: true, direction: directionMap[index] };
    }
    updateDefaultSortItem(payload);
  };
  return (
    <View style={[styles.container, disabledStyle]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.buttonDragContainer}>
        <ButtonGroup
          onPress={(index) => handleSortItemUpdate(index)}
          buttons={buttons}
          selectedIndex={buttonIndex}
          containerStyle={{ width: 125, height: 30, borderColor: "gray" }}
          selectedButtonStyle={{ backgroundColor: "red" }}
        />
        {/* <TouchableOpacity style={styles.dragHandle} onPress={() => console.log("TOUCHED")}>
          <DragHandleIcon size={30} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default SettingsSortItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#ccc",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  buttonDragContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dragHandle: {
    paddingHorizontal: 10,
  },
});
