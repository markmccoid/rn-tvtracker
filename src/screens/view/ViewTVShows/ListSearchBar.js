import React from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { useNavigation } from "@react-navigation/native";
import { useOActions, useOState } from "../../../store/overmind";
import { colors, styleHelpers } from "../../../globalStyles";

const ListSearchBar = ({ visible, onCancel = () => null }) => {
  const [localInput, setLocalInput] = React.useState("");
  const state = useOState();
  const actions = useOActions();
  const {
    filterData: { searchFilter },
  } = state.oSaved;
  const { setSearchFilter } = actions.oSaved;
  const navigation = useNavigation();
  console.log("listbarsearch", visible);
  const setInputData = (e) => {
    setLocalInput(e);
    setSearchFilter(e);
  };
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{
            height: 50,
          }}
          animate={{
            height: 75,
          }}
          exit={{
            height: 0,
          }}
          exitTransition={{ type: "timing", duration: 1000 }}
          transition={{ type: "timing", duration: 200 }}
          style={styles.container}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search Movie Title"
            onChangeText={(e) => setInputData(e)}
            value={localInput}
            clearButtonMode="while-editing"
          />
          <TouchableOpacity
            onPress={() => {
              setSearchFilter("");
              //setShowSearch(false);
              onCancel();
              navigation.setParams({ showSearch: false });
            }}
          >
            <Text>Cancel</Text>
          </TouchableOpacity>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#77777733",
    shadowColor: "#000",
  },
  searchInput: {
    margin: 10,
    padding: 10,
    borderColor: "darkgray",
    borderRadius: 5,
    borderWidth: 1,
    width: "80%",
    backgroundColor: "#ddd",
  },
  cancelButton: {},
});
export default ListSearchBar;
