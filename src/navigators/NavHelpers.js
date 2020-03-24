import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Badge } from "react-native-elements";
import { useOvermind } from "../store/overmind";

export const MovieDetailHeaderRight = props => {
  let { state } = useOvermind();
  const numberOfTags = state.oSaved.getMovieTags(props.movie.id).length;
  return (
    <TouchableOpacity
      onPress={() =>
        props.navigate("MovieDetailTagEdit", { movie: props.movie })
      }
    >
      <Feather name="tag" size={30} style={{ marginRight: 10 }} />
      {numberOfTags ? (
        <Badge
          status="success"
          value={numberOfTags}
          containerStyle={{
            position: "absolute",
            top: -5,
            right: 10
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

//props - navigate, movieId
