import _ from "lodash";
// These functions are used by the getters in the state
// They help abstract common functionality used by multiple getters
export const retrieveTagIds = (tagObjArray) => {
  return tagObjArray.map((tagObj) => tagObj.tagId);
};

export const retrieveMovieTagIds = (state, movieId) => {
  // Check to make sure we have tags for passed movieId
  if (!state.taggedMovies || !state.taggedMovies[movieId]) {
    return [];
  }
  return state.taggedMovies[movieId];
};
/**
 *
 * @param {*} state
 * @param {*} tagIdArray
 * @param {*} isSelected
 */
export const buildTagObjFromIds = (state, tagIdArray, isSelected) => {
  // loop through all tags and when find a match in passed tagIdArray
  // return an object { tagId, tagName, isSelected }
  let tagsObj = state.getTags.reduce((final, tagObj) => {
    if (tagIdArray.find((tagId) => tagId === tagObj.tagId)) {
      final = [...final, { tagId: tagObj.tagId, tagName: tagObj.tagName, isSelected }];
    }
    return final;
  }, []);
  return tagsObj;
};

//
export const buildGenreObjFromArray = (filterGenres, isSelected = true) => {
  // console.log(filterGenres);
  // console.log(filterGenres.map((genre) => ({ genre, isSelected })));
  // return filterGenres.map((genre) => ({ genre, isSelected }));
};

/**
 * Filter movies based on the passed in filterData
 * Version 2, different approach to the search/filter
 * Thinking that
 *
 * @param {array} savedMoviesIn - array of all movies saved
 * @param {*} filterData - data fo filter on
 */
export const filterMovies = (savedMoviesIn, filterData) => {
  let {
    tags: filterTags,
    tagOperator,
    genres: filterGenres,
    genreOperator,
    searchFilter,
  } = filterData;
  return savedMoviesIn.filter((movie, index) => {
    // Check each potential filter and bail (return false) on first one that fails.
    // Flag indicating if this movie should be included, i.e. matches all filter criteria.
    //shouldIncludeFlag = true;
    //=========================
    // Start with SearchFilter
    if (searchFilter) {
      // If the movie title doesn't match the search filter, bail on this movie
      if (!movie.title.toLowerCase().includes(searchFilter)) {
        return false;
      }
    }

    //=========================
    // Check Genres
    if (filterGenres?.length > 0) {
      if (genreOperator === "AND") {
        if (!filterGenres.every((genre) => movie.genres.includes(genre))) {
          return false;
        }
      } else if (genreOperator === "OR") {
        if (!filterGenres.some((genre) => movie.genres.includes(genre))) {
          return false;
        }
      }
    }

    //=========================
    // Filter based on Tags
    if (filterTags.length > 0) {
      if (movie?.taggedWith) {
        if (tagOperator === "AND" && filterTags?.length > 0) {
          // AND filter for passed tags
          if (!filterTags.every((tag) => movie?.taggedWith.includes(tag))) {
            return false;
          }
        } else if (tagOperator === "OR" && filterTags?.length > 0) {
          // OR filter for passed tags
          if (!movie?.taggedWith.some((tagId) => filterTags.includes(tagId))) {
            return false;
          }
        }
      } else {
        // the movie object has no taggedWith object, meaning not tagged yet
        // this should not be included in the results
        return false;
      }
    }
    return true;
  });
};
/**
 *
 * @param {array} tagsToSort - Array of tag objects
 * @param {object} config - sortType and helpers
 */
export const tagSorter = (unsortedTags, config) => {
  const { sortType } = config;
  // We want to return the tags sorted as they are in the original array
  // Pull all the tags and return the array sorted tag with the isSelected
  // property pulled from unsorted tags
  if (sortType === "fromarray") {
    const sortedTags = config.sortedTagArray;
    return sortedTags.map((tagObj) => ({
      tagId: tagObj.tagId,
      tagName: tagObj.tagName,
      isSelected: unsortedTags[tagObj.tagId].isSelected,
    }));
  }
};
