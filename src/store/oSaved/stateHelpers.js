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
      final = [
        ...final,
        { tagId: tagObj.tagId, tagName: tagObj.tagName, isSelected },
      ];
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
 *
 * @param {array} savedMoviesIn - array of all movies saved
 * @param {object} taggedMovies - object of all movies that are tagged and their tags
 * @param {*} filterData - data fo filter on
 */
export const filterMovies = (savedMoviesIn, taggedMovies, filterData) => {
  let movieTags = taggedMovies;
  let {
    tags: filterTags,
    tagOperator,
    genres: filterGenres,
    genreOperator,
    searchFilter,
  } = filterData;
  let savedMovies = [...savedMoviesIn];
  // If we have no tags stored for movies in taggedMovies
  // then return empty array as no movies will match since no movies have been tagged.
  if (!movieTags && !searchFilter) {
    return [];
  }
  // Filter movies based on text typed in search box
  if (searchFilter) {
    savedMovies = savedMovies.filter((item) =>
      item.title.toLowerCase().includes(searchFilter)
    );
  }
  //-------------------------
  // Filter based on Tags
  if (tagOperator === "AND" && filterTags?.length > 0) {
    // AND filter for passed tags
    savedMovies = savedMovies.filter((movie) => {
      if (movieTags[movie.id]) {
        return filterTags.every((tag) => movieTags[movie.id].includes(tag));
      }
      return false;
    });
  } else if (tagOperator === "OR" && filterTags?.length > 0) {
    // OR filter for passed tags
    savedMovies = savedMovies.filter((movie) => {
      if (movieTags[movie.id]) {
        return movieTags[movie.id].some((tagId) => filterTags.includes(tagId));
      }
      return false;
    });
  }
  //-------------------------
  // Filter based on Genres
  if (filterGenres?.length > 0) {
    if (genreOperator === "AND") {
      savedMovies = savedMovies.filter((movie) => {
        return filterGenres.every((genre) => movie.genres.includes(genre));
      });
    } else if (genreOperator === "OR") {
      savedMovies = savedMovies.filter((movie) => {
        return filterGenres.some((genre) => movie.genres.includes(genre));
      });
    }
  }

  return savedMovies;
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
