import React from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, ScrollView } from "@motify/components";
import { MotiView, AnimatePresence, motify } from "moti";

import { colors } from "../../../globalStyles";
import DetailSelectTags from "../ViewDetails/DetailSelectTags";
import { useOState, useOActions } from "../../../store/overmind";
import { useDimensions } from "@react-native-community/hooks";
import { EditIcon, CloseIcon, AddIcon } from "../../../components/common/Icons";

//-- Animation props ------------
const animTags = {
  from: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0.1,
    height: 0,
  },
};

const animIcon = {
  from: {
    opacity: 0,
    rotate: "180deg",
  },
  animate: {
    opacity: 1,
    rotate: "0deg",
  },
  transition: {
    delay: 100,
  },
};
//-- Animation props ------------

// ------------------------
// Add Or Edit Tag Button
// ------------------------
const AddEditTagButton = ({ noTags, onPress }) => {
  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: noTags ? 1 : 0,
      borderColor: colors.listBorder,
      paddingHorizontal: 5,
      paddingVertical: noTags ? 0 : 5,
      borderRadius: 5,
      backgroundColor: noTags ? colors.buttonPrimary : undefined,
    },
    text: {
      color: colors.buttonPrimaryText,
    },
  });
  return (
    <Pressable
      style={({ pressed }) => {
        return {
          backgroundColor: pressed ? "#ffffff66" : "transparent",
          transform: [{ translateX: pressed ? 2 : 0 }],
          paddingRight: 10,
        };
      }}
      onPress={onPress}
    >
      <MotiView {...animIcon} style={styles.wrapper}>
        {noTags ? (
          <MotiView
            style={{ flexDirection: "row", alignItems: "center" }}
            from={{
              scale: 0.6,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              type: "timing",
              duration: 1000,
              delay: 200,
            }}
          >
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: 1.3 }}
              transition={{
                type: "timing",
                duration: 1000,
                loop: true,
              }}
            >
              <AddIcon size={25} color={colors.buttonPrimaryText} />
            </MotiView>
            <Text style={styles.text}>Add Tags</Text>
          </MotiView>
        ) : (
          <EditIcon size={20} color={"black"} style={{ marginTop: -5 }} />
        )}
      </MotiView>
    </Pressable>
  );
};

// --------------------
// MAIN Component Code
// --------------------
const DetailToggleTags = ({ tvShowId }) => {
  const [viewTags, setViewTags] = React.useState(false);
  const state = useOState();
  const actions = useOActions();

  let tags = state.oSaved.getAllTVShowTags(tvShowId);
  let assignedTags = state.oSaved.getTVShowTags(tvShowId);
  let { removeTagFromTVShow, addTagToTVShow } = actions.oSaved;
  const { width, height } = useDimensions().window;

  return (
    <View style={styles.wrapper}>
      <AnimatePresence>
        {viewTags && (
          <MotiView
            from={{
              opacity: 0,
              scale: 0.5,
              // height: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.1,
              height: 0,
            }}
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            <MotiView {...animIcon}>
              <TouchableOpacity
                style={{ alignSelf: "flex-start" }}
                onPress={() => {
                  setViewTags((prev) => !prev);
                }}
              >
                <CloseIcon size={25} />
              </TouchableOpacity>
            </MotiView>
            <DetailSelectTags
              viewTags={viewTags}
              tags={tags}
              onSelectTag={(tagObj) =>
                addTagToTVShow({ tvShowId: tvShowId, tagId: tagObj.tagId })
              }
              removeTagFromTVShow={(tagObj) =>
                removeTagFromTVShow({
                  tvShowId: tvShowId,
                  tagId: tagObj.tagId,
                })
              }
            />
          </MotiView>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!viewTags && (
          <MotiView
            from={{
              opacity: 0,
              scale: 0.5,
              // height: 0,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              translateY: -110,
            }}
            exitTransition={{
              type: "timing",
              duration: 300,
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <AddEditTagButton
              onPress={() => setViewTags((prev) => !prev)}
              noTags={assignedTags.length === 0}
            />
            {/* Scrollview items are animated to delay longer based on their index */}
            <ScrollView horizontal style={{ width }}>
              <Pressable
                style={{ flexDirection: "row" }}
                onPress={() => setViewTags((prev) => !prev)}
              >
                {assignedTags.map((tagObj, index) => {
                  return (
                    <MotiView
                      key={tagObj.tagId}
                      from={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "timing", delay: index * 100 }}
                    >
                      <Text style={styles.tagItem}>{tagObj.tagName}</Text>
                    </MotiView>
                  );
                })}
                <Text style={{ width: 10 }}></Text>
              </Pressable>
            </ScrollView>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // flexDirection: "column",
    alignItems: "center",
    marginLeft: 3,
    marginRight: 3,
    // borderWidth: 1,
    // borderColor: colors.commonBorder,
    borderRadius: 5,
    padding: 5,
    paddingRight: 0,
    marginBottom: 5,
  },
  tagItem: {
    borderWidth: 1,
    borderColor: colors.listBorder,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
    marginBottom: 4,
    backgroundColor: `${colors.includeGreen}55`,
  },
  tagEdit: {
    backgroundColor: colors.includeGreen,
    borderRadius: 3,
    fontWeight: "bold",
  },
});
export default DetailToggleTags;
