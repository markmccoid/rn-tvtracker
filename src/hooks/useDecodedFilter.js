import React, { useEffect, useState, useMemo } from "react";
import { Text, View } from "react-native";
import _ from "lodash";

import { colors } from "../globalStyles";
/** useDecodedFilter
 * @param { array } filterTags - Array of tag objects [ {tagId, tagName, tagState }, ... ]
 * @param { object } filterData - tag operator --> { tagOperator, excludeTagOperator}
 * @return { object } - returns the decode object
 */

export const useDecodedFilter = (filterTags, filterData) => {
  const [decodedMessage, setDecodedMessage] = useState({ decodedText: "No Message" });

  // state that will count how many include and exclude tags we have
  // Count the tags when filterTags change.
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
    // setTagCounts(tagCountObj);
    return tagCountObj;
  }, [filterTags]);

  // Only "decode" filter if something has changed since last decode
  useEffect(() => {
    setDecodedMessage(getDecodedFilter());
  }, [
    tagCounts.include,
    tagCounts.exclude,
    filterData.tagOperator,
    filterData.excludeTagOperator,
  ]);

  const getDecodedFilter = () => {
    const includeOperator = ` ${filterData.tagOperator} `;
    const excludeOperator = ` ${filterData.excludeTagOperator} `;

    const messages = {
      includeMessage: "Find movies that have",
      excludeMessage: "Find movies that DO NOT have",
      includeActive: false,
      excludeActive: false,
      finalMessage: `No tag filtering is active.`,
    };

    // Include tags with only 1 selected
    if (tagCounts.include === 1) {
      messages.includeMessage = `${messages.includeMessage} the tag "${
        _.find(filterTags, { tagState: "include" })?.tagName
      }"`;
      messages.includeActive = true;
    }
    // Exclude tags with only 1 selected
    if (tagCounts.exclude === 1) {
      messages.excludeMessage = `${messages.excludeMessage} the tag "${
        _.find(filterTags, { tagState: "exclude" })?.tagName
      }"`;
      messages.excludeActive = true;
    }

    if (tagCounts.include > 1) {
      messages.includeMessage = `${messages.includeMessage} the ${tagCounts.includeTags.join(
        includeOperator
      )} tags`;
      messages.includeActive = true;
    }

    if (tagCounts.exclude > 1) {
      messages.excludeMessage = `${messages.excludeMessage} the ${tagCounts.excludeTags.join(
        excludeOperator
      )} tags`;
      messages.excludeActive = true;
    }
    // construct final message
    messages.finalMessage =
      messages.includeActive || messages.excludeActive
        ? `${messages.includeActive ? messages.includeMessage : ""}${
            messages.includeActive && messages.excludeActive ? " AND FROM THOSE " : ""
          }${messages.excludeActive ? messages.excludeMessage : ""}`
        : messages.finalMessage;

    // Instead of returning just the final message as text
    // return an array, with first being a component, second being just text, third being object of separate pieces.

    const boldInclude = tagCounts.includeTags.map((inTag) => (
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{inTag}</Text>
    ));
    const boldExclude = tagCounts.excludeTags.map((exTag) => (
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{exTag}</Text>
    ));
    const componentParts = { boldInclude, boldExclude };
    const testInclude = buildMessages(
      tagCounts,
      filterData.tagOperator,
      filterData.excludeTagOperator
    );
    console.log("testInclude", testInclude);
    return {
      finalMessage: messages.finalMessage,
      // MessageComponent: () => <Text>{messages.finalMessage}</Text>,
      MessageComponent: () => (
        <View style={{ flexDirection: "column" }}>
          {testInclude.formattedDefault}
          {testInclude.formattedInclude}
          {testInclude.formattedJoin}
          {testInclude.formattedExclude}
        </View>
      ),
    };
  };

  return decodedMessage;
};

function buildMessages(tagCounts, tagOperator, excludeTagOperator) {
  const includeIntro = `Find movies that have the tag `;
  const joinStatement = "---AND FROM THOSE---";
  const excludeIntro = "Find movies that DO NOT have the tag ";
  const defaultMessage = "No Tags selected for filtering.";

  // Build the Include Tags with TEXT components and proper AND/OR
  const includeFormatted = tagCounts.includeTags.reduce((final, el, idx) => {
    if (idx !== 0) {
      final.push(
        <>
          <Text
            style={{ fontSize: 18, color: colors.includeGreen, fontWeight: "800" }}
          >{` ${tagOperator} `}</Text>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>{`${el}`}</Text>
        </>
      );
    } else {
      final.push(<Text style={{ fontSize: 18, fontWeight: "800" }}>{el}</Text>);
    }
    return final;
  }, []);

  // Build the Exclude Tags with TEXT components and proper AND/OR
  const excludeFormatted = tagCounts.excludeTags.reduce((final, el, idx) => {
    if (idx !== 0) {
      final.push(
        <>
          <Text
            style={{ fontSize: 18, color: colors.excludeRed, fontWeight: "800" }}
          >{` ${excludeTagOperator} `}</Text>
          <Text style={{ fontSize: 18, fontWeight: "800" }}>{`${el}`}</Text>
        </>
      );
    } else {
      final.push(<Text style={{ fontSize: 18, fontWeight: "800" }}>{el}</Text>);
    }
    return final;
  }, []);

  // Build statements - include, exclude, join and a default formatted
  const formattedInclude =
    tagCounts.include > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        <Text style={{ fontSize: 18 }}>{includeIntro}</Text>
        {includeFormatted}
      </View>
    ) : null;
  const formattedExclude =
    tagCounts.exclude > 0 ? (
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        <Text style={{ fontSize: 18 }}>{excludeIntro}</Text>
        {excludeFormatted}
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
