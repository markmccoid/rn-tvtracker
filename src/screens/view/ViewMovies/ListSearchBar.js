import React, { useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useOActions, useOState } from "../../../store/overmind";

const ListSearchBar = ({ onCancel = () => null }) => {
  const state = useOState();
  const actions = useOActions();
  const { searchFilter } = state.oSaved;
  const { setSearchFilter } = actions.oSaved;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Movie Title"
        onChangeText={(e) => setSearchFilter(e)}
        value={searchFilter}
        autoFocus
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
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
