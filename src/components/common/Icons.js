import React from "react";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";

export const ViewMovieIcon = ({ size, color, style = {} }) => {
  return <MaterialIcons name="movie" size={size} color={color} style={style} />;
};
export const ViewTVShowIcon = ({ size, color, style = {} }) => {
  return <Feather name="tv" size={size} color={color} style={style} />;
};
export const EyeEmptyIcon = ({ size, color, style = {} }) => {
  return <AntDesign name="eyeo" size={size} color={color} style={style} />;
};
export const EyeFilledIcon = ({ size, color, style = {} }) => {
  return <AntDesign name="eye" size={size} color={color} style={style} />;
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
export const GenreIcon = ({ size, color, style }) => {
  return <MaterialCommunityIcons name="tag-faces" color={color} size={size} style={style} />;
};

export const UnTagIcon = ({ size, color, style }) => {
  return <Entypo name="untag" color={color} size={size} style={style} />;
};

export const ShareIcon = ({ size, color, style }) => {
  return <Entypo name="share-alternative" size={size} color={color} style={style} />;
};

export const IMDBIcon = ({ size, color, style }) => {
  return <Fontisto name="imdb" size={size} color={color} style={style} />;
};
export const FilterIcon = ({ size, color, style }) => {
  return (
    <Feather
      name="filter"
      size={size}
      color={color}
      style={[
        style,
        {
          shadowColor: "rgba(0,0,0, .4)",
          shadowOffset: { height: 1, width: 1 },
          shadowOpacity: 1,
          shadowRadius: 1,
        },
      ]}
    />
  );
};

export const CloseIcon = ({ size, color, style }) => {
  return <AntDesign name="close" size={size} color={color} style={style} />;
};

export const DeleteIcon = ({ size = 25, color = "#b20a2c", style }) => {
  return <AntDesign name="delete" size={size} color={color} style={style} />;
};

export const EraserIcon = ({ size = 25, color, style }) => {
  return <MaterialCommunityIcons name="eraser" size={size} color={color} style={style} />;
};

export const RefreshIcon = ({ size = 25, color, style }) => {
  return <FontAwesome name="refresh" size={size} color={color} style={style} />;
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

//# More (down) Less (up) icons
export const MoreIcon = ({ size, color, style }) => {
  return <AntDesign name="downcircleo" size={size} color={color} style={style} />;
};
export const LessIcon = ({ size, color, style }) => {
  return <AntDesign name="upcircleo" size={size} color={color} style={style} />;
};

//# BACK button icon for headers in screens
export const BackIcon = ({ size, color, style }) => {
  return <AntDesign name="back" size={size} color={color} style={style} />;
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
export const EmptyMDHeartIcon = ({ size, color, style }) => {
  return (
    <MaterialCommunityIcons name="heart-outline" color={color} size={size} style={style} />
  );
};
export const MDHeartIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-heart" color={color} size={size} style={style} />;
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

//# Other Icons
export const InfoIcon = ({ size, color, style }) => {
  return <Feather name="info" color={color} size={size} style={style} />;
};

//# SORT Icons
export const AscAlphaIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-alpha-asc" color={color} size={size} style={style} />;
};
export const DescAlphaIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-alpha-desc" color={color} size={size} style={style} />;
};
export const AscNumIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-numeric-asc" color={color} size={size} style={style} />;
};
export const DescNumIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-numeric-desc" color={color} size={size} style={style} />;
};
export const AscOtherIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-amount-asc" color={color} size={size} style={style} />;
};
export const DescOtherIcon = ({ size, color, style }) => {
  return <FontAwesome name="sort-amount-desc" color={color} size={size} style={style} />;
};

export const InfinityIcon = ({ size, color, style }) => {
  return <Ionicons name="ios-infinite" size={size} color={color} style={style} />;
};
