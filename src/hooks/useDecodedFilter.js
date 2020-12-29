import React, { useEffect, useState, useMemo } from "react";
import { Text, View } from "react-native";
import _ from "lodash";

import { colors } from "../globalStyles";

/** useDecodedFilter
 * @param { object } { filterTags - Array of tag objects [ {tagId, tagName, tagState }, ... ]
 *                     filterData - tag operator --> { tagOperator, excludeTagOperator, genreOperator}
 *                     filterGenres - Array of included genres to be filtered on
 *                    }
 * @return { object } - returns the decode object
 */

export const useDecodedFilter = ({ filterTags = [], filterData, filterGenres = [] }) => {
  const [decodedMessage, setDecodedMessage] = useState({ decodedText: "No Message" });

  //# Count the tags when filterTags change.
  // Using useMemo as we use this value to calculate, but do not need a rerender when value changes
  // As I understand useMemo will run before the render, thus before the useEffect that calls the function
  // that does the decoding and uses the tagCounts value.
  const tagCounts = useMemo(() => {
    const tagCountObj = filterTags.reduce(
      (tagCount, tag) => {
        // Key to hold the tags, will be either 'includeTags' or 'excludeTags'
        const tagProperty = `${tag.tagState}Tags`;
        if (tag.tagState === "inactive") return tagCount;
        tagCount[tag.tagState] = tagCount[tag.tagState] + 1;
        // add the include or exclude tag
        tagCount[tagProperty] = [...tagCount[tagProperty], `${tag.tagName}`];
        return tagCount;
      },
      { include: 0, exclude: 0, includeTags: [], excludeTags: [] }
    );
    // setTagCounts(tagCountObj);f
    return tagCountObj;
  }, [filterTags]);

  //# build selectedGenres Array
  const selectedGenres = useMemo(() => {
    return filterGenres
      .filter((genreObj) => genreObj.isSelected)
      .map((genreObj) => genreObj.genre);
  }, [filterGenres]);

  //# Tag Decode
  // Only "decode" filter if something has changed since last decode
  useEffect(() => {
    setDecodedMessage((prevObj) => ({ ...prevObj, ...decodeTagFilter() }));
  }, [
    tagCounts.include,
    tagCounts.exclude,
    filterData?.tagOperator,
    filterData?.excludeTagOperator,
  ]);

  //# Genre Decode
  useEffect(() => {
    setDecodedMessage((prevObj) => ({ ...prevObj, ...decodeGenreFilter() }));
  }, [selectedGenres?.length, filterData?.genreOperator]);

  const decodeTagFilter = () => {
    // build the formatted message as an object of React Components
    const formattedMessage = buildTagMessages(
      tagCounts,
      filterData.tagOperator,
      filterData.excludeTagOperator
    );
    //Compose the pieces into the final message
    return {
      TagMessageComponent: () => (
        <View style={{ flexDirection: "column" }}>
          {formattedMessage.formattedDefault}
          {formattedMessage.formattedInclude}
          {formattedMessage.formattedJoin}
          {formattedMessage.formattedExclude}
        </View>
      ),
    };
  };

  const decodeGenreFilter = () => {
    if (selectedGenres.length === 0) {
      return {
        GenreMessageComponent: () => (
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: 18 }}>No Genres selected for filtering</Text>
          </View>
        ),
      };
    }
    const formattedGenres = formatFilterItems(
      selectedGenres,
      filterData.genreOperator,
      colors.includeGreen
    );
    return {
      GenreMessageComponent: () => (
        <View style={{ flexDirection: "column" }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Text style={{ fontSize: 18 }}>Find movies with the {formattedGenres} genres</Text>
          </View>
        </View>
      ),
    };
  };

  return decodedMessage;
};

/**
 * Returns React Native formatted components
 *
 * @param tagCounts {object} - { include: {number}, exclude: {number}, includeTags: [selected Tag name(s)], excludeTags: [tag names] }
 * @param tagOperator {string} - Include AND/OR operator
 * @param excludeTagOperator {string} - Exclude AND/OR operator
 *
 * @return {object} - { formattedDefault, formattedInclude, formattedJoin, formattedExclude }
 */
function buildTagMessages(tagCounts, tagOperator, excludeTagOperator) {
  const includeIntro = `Find movies that have the `;
  const joinStatement = "---AND FROM THOSE---";
  const excludeIntro = "Find movies that DO NOT have the ";
  const defaultMessage = "No Tags selected for filtering.";

  // Build the Include Tags with TEXT components and proper AND/OR
  const includeFormatted = formatFilterItems(
    tagCounts.includeTags,
    tagOperator,
    colors.includeGreen
  );

  // Build the Exclude Tags with TEXT components and proper AND/OR
  const excludeFormatted = formatFilterItems(
    tagCounts.excludeTags,
    excludeTagOperator,
    colors.excludeRed
  );

  // Build statements - include, exclude, join and a default formatted
  const formattedInclude =
    tagCounts.include > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18 }}>
          {includeIntro}
          {includeFormatted}
          {` ${tagCounts.include > 1 ? "tags" : "tag"}`}
        </Text>
      </View>
    ) : null;
  const formattedExclude =
    tagCounts.exclude > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
        <Text style={{ fontSize: 18 }}>
          {excludeIntro}
          {excludeFormatted}
          {` ${tagCounts.exclude > 1 ? "tags" : "tag"}`}
        </Text>
      </View>
    ) : null;
  const formattedJoin =
    tagCounts.include > 0 && tagCounts.exclude > 0 ? (
      <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center" }}>
        {joinStatement}
      </Text>
    ) : null;

  const formattedDefault =
    formattedInclude || formattedExclude ? null : (
      <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center" }}>
        {defaultMessage}
      </Text>
    );

  // Return all statements
  return { formattedDefault, formattedInclude, formattedJoin, formattedExclude };
}

/**
 *
 *
 * @param {array} filterItems - an array of strings, either Tags or Genres
 * @param {string} operator - AND or OR
 * @param {string} operatorColor - Color to make the operator
 * @returns
 */
function formatFilterItems(filterItems, operator, operatorColor) {
  return filterItems.reduce((final, el, idx) => {
    if (idx !== 0) {
      final.push(
        <React.Fragment key={idx}>
          <Text
            style={{ fontSize: 18, color: operatorColor, fontWeight: "800" }}
          >{` ${operator} `}</Text>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>{`${el}`}</Text>
        </React.Fragment>
      );
    } else {
      final.push(
        <Text key={idx} style={{ fontSize: 18, fontWeight: "800" }}>
          {el}
        </Text>
      );
    }
    return final;
  }, []);
}
