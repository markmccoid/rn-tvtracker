import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useOActions, useOState } from "../../store/overmind";
import { Button } from "../../components/common/Buttons";
const { width, height } = Dimensions.get("window");

const UserRating = ({ movieId }) => {
  const actions = useOActions();
  const state = useOState();
  const { updateUserRatingToMovie } = actions.oSaved;
  const { getMovieUserRating } = state.oSaved;

  const arrayOf11 = new Array(11).fill(0);
  const currentUserRating = getMovieUserRating(movieId);
  return (
    <View style={styles.container}>
      {arrayOf11.map((_, idx) => {
        return (
          <Button
            key={idx}
            title={idx.toString()}
            onPress={() => updateUserRatingToMovie({ movieId, userRating: idx })}
            small
            bgColor={idx <= currentUserRating ? "yellow" : "white"}
            wrapperStyle={styles.buttonStyle}
          />
        );
      })}
    </View>
  );
};

export default UserRating;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",

    marginHorizontal: 5,
  },
  buttonStyle: {
    flex: 1,
  },
});
