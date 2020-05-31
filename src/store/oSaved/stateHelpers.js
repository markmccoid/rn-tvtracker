import _ from 'lodash';
// These functions are used by the getters in the state
// They help abstract common functionality used by multiple getters
export const retrieveTagIds = (tagObjArray) => {
  return tagObjArray.map((tagObj) => tagObj.tagId);
};

export const retrieveMovieTagIds = (state, movieId) => {
  // Check to make sure we have tags for passed movieId

  if (!state.userData.tags || !state.userData.tags[movieId]) {
    return [];
  }
  return state.userData.tags[movieId];
};

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
  return _.sortBy(tagsObj, ['tagName']);
};

export const filterMovies = (savedMoviesIn, userData, filterData) => {
  let movieTags = userData.tags;
  let { tags: filterTags, tagOperator, searchFilter } = filterData;
  let savedMovies = [...savedMoviesIn];
  // If we have no tags stored for movies in userData.tags
  // then return empty array as no movies will match since no movies have been tagged.
  // Remember userData.tag is an object with movieIds as the key/property
  if (!movieTags && !searchFilter) {
    return [];
  }
  if (searchFilter) {
    savedMovies = savedMovies.filter((item) =>
      item.title.toLowerCase().includes(searchFilter)
    );
  }
  if (tagOperator === 'AND' && filterTags?.length > 0) {
    // AND filter for passed tags
    savedMovies = savedMovies.filter((movie) => {
      if (movieTags[movie.id]) {
        return filterTags.every((tag) => movieTags[movie.id].includes(tag));
      }
      return false;
    });
  } else if (tagOperator === 'OR' && filterTags?.length > 0) {
    // OR filter for passed tags
    savedMovies = savedMovies.filter((movie) => {
      if (movieTags[movie.id]) {
        return movieTags[movie.id].some((tagId) => filterTags.includes(tagId));
      }
      return false;
    });
  }
  return savedMovies;
};
