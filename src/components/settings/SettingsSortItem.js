import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { ButtonGroup } from "react-native-elements";
import {
  AscAlphaIcon,
  AscNumIcon,
  AscOtherIcon,
  DescNumIcon,
  DescAlphaIcon,
  DescOtherIcon,
} from "../../components/common/Icons";

function getButtonState(active, direction) {
  const indexMap = { asc: 0, desc: 1 };
  return indexMap[direction];
}
const SettingsSortItem = ({
  title,
  direction,
  active,
  type = "num",
  updateDefaultSortItem,
}) => {
  const directionMap = { asc: 0, desc: 1 };
  const [buttonIndex, setButtonIndex] = React.useState(directionMap[direction]);

  const disabledStyle = !active ? { backgroundColor: "#ccc" } : {};
  const buttons = {
    alpha: [
      { element: () => <AscAlphaIcon size={20} color={active ? null : "#777"} /> },
      { element: () => <DescAlphaIcon size={20} color={active ? null : "#777"} /> },
    ],
    num: [
      { element: () => <AscNumIcon size={20} color={active ? null : "#777"} /> },
      { element: () => <DescNumIcon size={20} color={active ? null : "#777"} /> },
    ],
    date: [
      { element: () => <AscOtherIcon size={20} color={active ? null : "#777"} /> },
      { element: () => <DescOtherIcon size={20} color={active ? null : "#777"} /> },
    ],
  };
  const sortDescription = {
    alpha: {
      asc: "Sort Text from A to Z",
      desc: "Sort Text from Z to A",
    },
    num: {
      asc: "Sort Number from Lowest to Highest",
      desc: "Sort Number from Highest to Lowest",
    },
    date: {
      asc: "Sort Dates from Oldest to Most Recent",
      desc: "Sort Dates from Most Recent to Oldest",
    },
  };

  React.useEffect(() => {
    setButtonIndex(getButtonState(active, direction));
  }, [direction, active]);

  const handleSortItemUpdate = (index) => {
    let payload = { title, active, direction };
    let indexDecodeMap = { 0: "asc", 1: "desc" };
    payload = { ...payload, active: true, direction: indexDecodeMap[index] };
    updateDefaultSortItem(payload);
  };
  const toggleActive = (_) => {
    updateDefaultSortItem({ active: !active, title, direction });
  };
  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer, disabledStyle]}>
        <Text style={[styles.title, !active ? { color: "#555" } : {}]}>{title}</Text>
        <View style={styles.buttonDragContainer}>
          <Switch value={active} onChange={toggleActive} />
          <ButtonGroup
            disabled={!active}
            disabledStyle={{ backgroundColor: "#e3e6e8" }}
            onPress={(index) => handleSortItemUpdate(index)}
            buttons={buttons[type]}
            selectedIndex={buttonIndex}
            containerStyle={{ width: 125, height: 30, borderColor: "gray" }}
            buttonStyle={{ backgroundColor: "#e3e6e8" }}
            selectedButtonStyle={{ backgroundColor: "#34c759" }}
          />
        </View>
      </View>

      <View style={[styles.sortItemDesc, disabledStyle]}>
        <Text>{sortDescription[type][direction]}</Text>
      </View>
    </View>
  );
};

export default SettingsSortItem;

const styles = StyleSheet.create({
  container: {
    // borderColor: "#888",
    // borderWidth: 1,
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  sortItemDesc: {
    paddingHorizontal: 10,
    paddingVertical: 2,
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
