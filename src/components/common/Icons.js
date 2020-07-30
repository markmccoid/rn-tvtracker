import React from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
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

export const DeleteIcon = ({ size = 25, color = "#b20a2c", style }) => {
  return <AntDesign name="delete" size={size} color={color} style={style} />;
};

export const CheckIcon = ({ size, color, style }) => {
  return (
    <AntDesign name="checkcircleo" size={size} color={color} style={style} />
  );
};

export const MenuIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-menu" size={size} color={color} style={style} />;
};

export const EditIcon = ({ size, color, style }) => {
  return <Feather name="edit" size={size} color={color} style={style} />;
};

export const HeartIcon = ({ size, color, style }) => {
  return <AntDesign name="hearto" size={size} color={color} style={style} />;
};

export const ImagesIcon = ({ size, color, style }) => {
  return <FontAwesome5 name="images" size={size} color={color} style={style} />;
};

export const CaretRightIcon = ({ size, color, style }) => {
  return (
    <FontAwesome name="caret-right" size={size} color={color} style={style} />
  );
};
export const CaretDownIcon = ({ size, color, style }) => {
  return (
    <FontAwesome name="caret-down" size={size} color={color} style={style} />
  );
};

//----------------
//- Drawer Icons
//----------------
export const SignOutIcon = ({ size, color, style }) => {
  return (
    <FontAwesome name="sign-out" color={color} size={size} style={style} />
  );
};
export const HomeIcon = ({ size, color, style }) => {
  return <FontAwesome name="home" color={color} size={size} style={style} />;
};
export const SettingsIcon = ({ size, color, style }) => {
  return (
    <Ionicons name="ios-settings" color={color} size={size} style={style} />
  );
};
export const UserIcon = ({ size, color, style }) => {
  return <FontAwesome name="user" color={color} size={size} style={style} />;
};
