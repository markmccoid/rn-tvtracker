import React from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

export const ViewMovieIcon = ({ size, color, style = {} }) => {
  return <MaterialIcons name="movie" size={size} color={color} style={style} />;
};

export const SearchIcon = ({ size, color, style }) => {
  return <MaterialIcons name="search" size={size} color={color} style={style} />;
};

export const DragHandleIcon = ({ size, color, style }) => {
  return <MaterialIcons name="drag-handle" size={size} color={color} style={style} />;
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

//OLD Check icon has circle around it
// export const CheckIcon = ({ size, color, style }) => {
//   return (
//     <AntDesign name="checkcircleo" size={size} color={color} style={style} />
//   );
// };
// New Check icon has no circle around it
export const CheckIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-checkmark" color={color} size={size} style={style} />;
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
  return <FontAwesome name="caret-right" size={size} color={color} style={style} />;
};
export const CaretDownIcon = ({ size, color, style }) => {
  return <FontAwesome name="caret-down" size={size} color={color} style={style} />;
};

//----------------
//- Drawer Icons
//----------------
export const SignOutIcon = ({ size, color, style }) => {
  return <FontAwesome name="sign-out" color={color} size={size} style={style} />;
};
export const HomeIcon = ({ size, color, style }) => {
  return <FontAwesome name="home" color={color} size={size} style={style} />;
};
export const SettingsIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-settings" color={color} size={size} style={style} />;
};
export const UserIcon = ({ size, color, style }) => {
  return <FontAwesome name="user" color={color} size={size} style={style} />;
};
//Plus sign icon
export const AddIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-add" color={color} size={size} style={style} />;
};

// Other Icons

export const ThumbsUpIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-thumbs-up" color={color} size={size} style={style} />;
};

export const YouTubePlayIcon = ({ size, color, style }) => {
  return <FontAwesome name="youtube-play" color={color} size={size} style={style} />;
};

export const SyncIcon = ({ size, color, style }) => {
  // return <FontAwesome5 name="sync-alt" size={size} color={color} style={style} />;
  return <MaterialCommunityIcons name="cloud-sync" size={size} color={color} style={style} />;
};

export const CarouselIcon = ({ size, color, style }) => {
  // return <FontAwesome5 name="sync-alt" size={size} color={color} style={style} />;
  return <MaterialIcons name="view-carousel" size={size} color={color} style={style} />;
};

export const ExpandDownIcon = ({ size, color, style }) => {
  return (
    <MaterialCommunityIcons name="arrow-expand-down" color={color} size={size} style={style} />
  );
};

export const CollapseUpIcon = ({ size, color, style }) => {
  return (
    <MaterialCommunityIcons name="arrow-collapse-up" color={color} size={size} style={style} />
  );
};

export const PowerIcon = ({ size, color, style }) => {
  return <Feather name="power" color={color} size={size} style={style} />;
};
