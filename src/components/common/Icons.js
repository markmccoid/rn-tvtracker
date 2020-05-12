import React from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

export const ViewMovieIcon = ({ size, color, style = {} }) => {
  return <MaterialIcons name="movie" size={size} color={color} style={style} />;
};

export const SearchIcon = ({ size, color, style }) => {
  return (
    <MaterialIcons name="search" size={size} color={color} style={style} />
  );
};

export const TagIcon = ({ size, color, style }) => {
  return <FontAwesome name="tags" color={color} size={size} style={style} />;
};

export const FilterIcon = ({ size, color, style }) => {
  return <Feather name="filter" size={size} color={color} style={style} />;
};

export const CloseIcon = ({ size, color, style }) => {
  return <AntDesign name="close" size={size} color={color} style={style} />;
};

export const DeleteIcon = ({ size, color, style }) => {
  return <AntDesign name="delete" size={size} color={color} style={style} />;
};

export const CheckIcon = ({ size, color, style }) => {
  return (
    <AntDesign name="checkcircleo" size={size} color={color} style={style} />
  );
};
