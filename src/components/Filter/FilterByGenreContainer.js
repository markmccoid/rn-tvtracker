import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { fonts } from "../../globalStyles";
import { EraserIcon, InfoIcon } from "../../components/common/Icons";

import { useDecodedFilter } from "../../hooks/useDecodedFilter";
import TagCloud, { TagItem } from "../../components/TagCloud/TagCloud";
import FilterGenreInfoOverlay from "./FilterGenreInfoOverlay";

/** props
 *   allGenreFilterTags - array of filter tags in format of { genre, isSelected }
 *   genreOperators - array of tagOperators, ['AND', 'OR']
 *   genreOperator - current value of genre operator
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

/*
 TAG Logic Descriptions
AND/OR (=1) - Find TV Shows that have the tag Favorite
AND (>1) - Find TV Shows that have ALL of the tags Favorite and New and ...
OR (=1) - Find TV Shows that have ONE of the tags Favorite Or new Or ...
AND ALSO
NOT AND/OR (=1) - Find TV Shows the Do NOT have the tag Favorite
NOT AND (>1) - Find TV Shows that Do NOT have ALL(Any) of the tags Favorite and New and ...
NOT OR (>1) - Find TV Shows that Do NOT have ONE of the tags Favorite Or New Or ...
 */

const FilterByGenreContainer = ({
  titleSize = "m",
  title = "Filter by Genre",
  allGenreFilters,
  genreOperator,
  filterFunctions,
}) => {
  const {
    addGenreToFilter,
    removeGenreFromFilter,
    setGenreOperator,
    clearFilterGenres, //Optional
  } = filterFunctions;

  const [overlayVisible, setOverlayVisible] = React.useState(false);

  const { GenreMessageComponent } = useDecodedFilter({
    filterGenres: allGenreFilters,
    filterData: { genreOperator },
  });

  const titleIconSize = { s: 15, m: 18, l: 22 };

  return (
    <View>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginRight: 15,
          }}
        >
          <TouchableOpacity onPress={() => setOverlayVisible((prev) => !prev)}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <Text style={[styles.title, { paddingRight: 10, fontSize: fonts[titleSize] }]}>
                {title}
              </Text>
              <InfoIcon size={titleIconSize[titleSize]} />
            </View>
          </TouchableOpacity>
          {clearFilterGenres && (
            <TouchableOpacity onPress={clearFilterGenres}>
              <EraserIcon size={titleIconSize[titleSize]} />
            </TouchableOpacity>
          )}
        </View>

        {overlayVisible && (
          <FilterGenreInfoOverlay
            filtersDecodedMessage={`genre decoded message`}
            MessageComponent={GenreMessageComponent}
            genreOperator={genreOperator}
            setGenreOperator={setGenreOperator}
            isVisible={overlayVisible}
            toggleVisibility={() => setOverlayVisible((prev) => !prev)}
          />
        )}
      </View>
      <TagCloud>
        {allGenreFilters.map((genreObj) => {
          const { genre, isSelected } = genreObj;
          return (
            <TagItem
              key={genre}
              tagId={genre}
              tagName={genre}
              isSelected={isSelected}
              onSelectTag={() => addGenreToFilter(genre)}
              onDeSelectTag={() => removeGenreFromFilter(genre)}
            />
          );
        })}
      </TagCloud>
    </View>
  );
};

export default FilterByGenreContainer;

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

FilterByGenreContainer.propTypes = {
  titleSize: PropTypes.string,
  title: PropTypes.string,
  allGenreFilters: PropTypes.arrayOf(
    PropTypes.shape({
      genre: PropTypes.string,
      isSelected: PropTypes.bool,
    })
  ),
  genreOperator: PropTypes.oneOf(["AND", "OR"]),
  filterFunctions: PropTypes.shape({
    addGenreToFilter: PropTypes.func.isRequired,
    removeGenreFromFilter: PropTypes.func.isRequired,
    setGenreOperator: PropTypes.func.isRequired,
    clearFilterGenres: PropTypes.func,
  }),
};
