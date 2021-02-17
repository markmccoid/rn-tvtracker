import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { fonts } from "../../globalStyles";
import { EraserIcon, InfoIcon } from "../common/Icons";

import TagCloud, { TagItem } from "../TagCloud/TagCloud";

/** props
 *   allGenreFilterTags - array of filter tags in format of { genre, isSelected }
 *   filterFunctions - functions needed by TagCloud -
 *   { onAddIncludeTag:
 *     onRemoveIncludeTag: removeTagFromFilter,
 *     onAddExcludeTag: addExcludeTagToFilter,
 *     onRemoveExcludeTag: removeExcludeTagFromFilter,
 *     setTagOperator,
 *     setExcludeTagOperator,
 *    }
 *
 */

const DiscoverByGenre = ({
  titleSize = "m",
  title = "Search by Genre",
  selectedGenres,
  allGenreFilters,
  filterFunctions,
}) => {
  const {
    addGenreToFilter,
    removeGenreFromFilter,
    clearFilterGenres, //Optional
  } = filterFunctions;

  const titleIconSize = { s: 15, m: 18, l: 22 };
  const genresObj = allGenreFilters.map((genreObj) => {
    if (selectedGenres.includes(genreObj.id)) {
      return { ...genreObj, isSelected: true };
    } else {
      return { ...genreObj, isSelected: false };
    }
  });
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginRight: 15,
        }}
      >
        <Text style={[styles.title, { fontSize: titleIconSize[titleSize] }]}>{title} </Text>
        {clearFilterGenres && (
          <TouchableOpacity onPress={clearFilterGenres}>
            <EraserIcon size={titleIconSize[titleSize]} />
          </TouchableOpacity>
        )}
      </View>
      <TagCloud>
        {genresObj.map((genreObj) => {
          const { id, name, isSelected } = genreObj;
          return (
            <TagItem
              key={id}
              tagId={name}
              tagName={name}
              isSelected={isSelected}
              onSelectTag={() => addGenreToFilter(id)}
              onDeSelectTag={() => removeGenreFromFilter(id)}
              // onSelectTag={() => addGenreToFilter({ id, name })}
              // onDeSelectTag={() => removeGenreFromFilter({ id, name })}
            />
          );
        })}
      </TagCloud>
    </View>
  );
};

export default DiscoverByGenre;

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
  },
  buttonStyle: {
    width: 150,
  },
  booleanContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  switchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
  },
  switchText: {
    fontWeight: "bold",
    marginLeft: 10,
  },
});

DiscoverByGenre.propTypes = {
  titleSize: PropTypes.string,
  title: PropTypes.string,
  allGenreFilters: PropTypes.arrayOf(
    PropTypes.shape({
      genre: PropTypes.string,
      isSelected: PropTypes.bool,
    })
  ),
  filterFunctions: PropTypes.shape({
    addGenreToFilter: PropTypes.func.isRequired,
    removeGenreFromFilter: PropTypes.func.isRequired,
    clearFilterGenres: PropTypes.func,
  }),
};
