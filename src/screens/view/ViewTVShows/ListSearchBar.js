import React from "react";
import {
  View,
  TextInput,
  Switch,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { MotiView, AnimatePresence } from "moti";
import { useOActions, useOState } from "../../../store/overmind";
import { colors, styleHelpers } from "../../../globalStyles";

const ListSearchBar = ({ visible, onCancel = () => null }) => {
  const [localInput, setLocalInput] = React.useState("");
  const { width, height } = useWindowDimensions();
  // const [ignoreFilter, setIgnoreFilter] = React.useState(false);

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

  const state = useOState();
  const actions = useOActions();
  const {
    filterData: { searchFilter, ignoreFilterOnSearch },
  } = state.oSaved;
  const { setSearchFilter, setIgnoreFilterOnSearch } = actions.oSaved;

  const setInputData = (e) => {
    setSearchFilter(e);
    setLocalInput(e);
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
          exitTransition={{ type: "timing", duration: 300 }}
          transition={{ type: "timing", duration: 200 }}
          style={styles.container}
        >
          <TextInput
            style={[
              styles.searchInput,
              ignoreFilterOnSearch && styles.ignoreFilterStyle,
            ]}
            placeholder="Search TV Title"
            onChangeText={(e) => setInputData(e)}
            value={localInput}
            clearButtonMode="while-editing"
          />
          <View
            style={{
              flexDirection: "column",
              width: width / 5,
              marginRight: 10,
            }}
          >
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
                thumbColor={
                  ignoreFilterOnSearch ? colors.includeGreen : "white"
                }
                value={ignoreFilterOnSearch}
                onValueChange={() =>
                  setIgnoreFilterOnSearch(!ignoreFilterOnSearch)
                }
              />
            </View>
          </View>
        </MotiView>
      )}
    </AnimatePresence>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderBottomColor: "#77777733",
//     shadowColor: "#000",
//   },
//   searchInput: {
//     marginVertical: 10,
//     marginRight: 10,
//     padding: 10,
//     borderColor: "darkgray",
//     borderRadius: 5,
//     borderWidth: 1,
//     width: width / 1.35 - 20,
//     backgroundColor: "#ddd",
//   },
//   ignoreFilterStyle: {
//     borderWidth: 1,
//     borderColor: "green",
//   },
//   cancelButton: {},
// });
export default ListSearchBar;
