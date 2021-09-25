import React from "react";
import { View, TextInput, Switch, Text, StyleSheet, Dimensions } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MotiView, AnimatePresence } from "moti";
import { useNavigation } from "@react-navigation/native";
import { useOActions, useOState } from "../../../store/overmind";
import PressableButton from "../../../components/common/PressableButton";
import { colors, styleHelpers } from "../../../globalStyles";
import { CloseIcon, InfinityIcon } from "../../../components/common/Icons";

const { width, height } = Dimensions.get("window");

const ListSearchBar = ({ visible, onCancel = () => null }) => {
  const [localInput, setLocalInput] = React.useState("");
  const [ignoreFilter, setIgnoreFilter] = React.useState(false);

  const state = useOState();
  const actions = useOActions();
  const {
    filterData: { searchFilter, ignoreFilterOnSearch },
  } = state.oSaved;
  const { setSearchFilter, setIgnoreFilterOnSearch } = actions.oSaved;
  const navigation = useNavigation();
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
            style={[styles.searchInput, ignoreFilterOnSearch && styles.ignoreFilterStyle]}
            placeholder="Search Movie Title"
            onChangeText={(e) => setInputData(e)}
            value={localInput}
            clearButtonMode="while-editing"
          />
          <View style={{ flexDirection: "column", width: width / 5, marginRight: 10 }}>
            {/* <PressableButton
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 10,
                margin: 0,
                borderWidth: 1,
              }}
              type="primary"
              onPress={() => {
                setLocalInput("");
                setSearchFilter("");
                //setShowSearch(false);
                onCancel();
                navigation.setParams({ showSearch: false });
              }}
            >
              <CloseIcon size={15} />
            </PressableButton> */}

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderTopWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                borderColor: ignoreFilterOnSearch
                  ? `${colors.includeGreen}cc`
                  : `${colors.commonBorder}cc`,
                borderRadius: 10,
              }}
            >
              <Text style={{ paddingLeft: 6, fontSize: 12 }}>Search All</Text>
              <Switch
                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                trackColor={{ false: "", true: "green" }}
                thumbColor={ignoreFilterOnSearch ? colors.includeGreen : "white"}
                value={ignoreFilterOnSearch}
                onValueChange={() => setIgnoreFilterOnSearch(!ignoreFilterOnSearch)}
              />
              {/*   <BouncyCheckbox
                size={20}
                fillColor="red"
                unfillColor="#FFFFFF"
                text="Search All"
                iconStyle={{ borderColor: "red" }}
                // textStyle={{ fontSize: 14 }}
                disableText
                disableBuiltInState
                isChecked={ignoreFilterOnSearch}
                onPress={() => {
                  setIgnoreFilterOnSearch(!ignoreFilterOnSearch);
                  // console.log("ischecked?", isChecked);
                }}
              />
              */}
            </View>
          </View>
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
    marginVertical: 10,
    marginRight: 10,
    padding: 10,
    borderColor: "darkgray",
    borderRadius: 5,
    borderWidth: 1,
    width: width / 1.35 - 20,
    backgroundColor: "#ddd",
  },
  ignoreFilterStyle: {
    borderWidth: 1,
    borderColor: "green",
  },
  cancelButton: {},
});
export default ListSearchBar;
