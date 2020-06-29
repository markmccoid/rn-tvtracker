import _ from 'lodash';
import * as actions from './actions';
import * as effects from './effects';
import { onInitialize } from './onInitialize';
import * as helpers from './stateHelpers';

export const config = {
  onInitialize,
  state: {
    savedMovies: [], // Movie data pulled from @markmccoid/tmdb_api
    tagData: [], // Array of Objects containing tag info { tagId, tagName, members[]??}
    // Object containing movieIds and related user data like tags
    userData: {
      tags: {},
    },
    // Object containing any filter data
    filterData: {
      tags: [],
      tagOperator: 'OR',
      searchFilter: undefined,
    },
    // saved filters that can be applied
    // will be an array of object {id, name, description, tagOperator, tags: []}
    savedFilters: [],
    //------- Getters -----------//
    // sort = ['title', 'date']
    getFilteredMovies: (state) => (sort = 'title', direction = 'asc') => {
      let movieList = state.savedMovies;
      // set lodash sort iteratees (either title or a function for date)
      if (sort === 'date') {
        sort = (el) => el.releaseDate.date;
      }
      //Determine if we are filtering via Tags or with a typed in Search
      if (state.filterData.tags.length > 0 || state.filterData.searchFilter) {
        movieList = helpers.filterMovies(
          state.savedMovies,
          state.userData,
          state.filterData
        );
      }
      movieList = _.sortBy(movieList, [sort]);
      return direction === 'asc' ? movieList : movieList.reverse();
    },
    //--------------
    // Get the movie details object for the passed movie ID
    getMovieDetails: (state) => (movieId) => {
      if (!movieId) {
        return null;
      }
      let moviesObj = _.keyBy(state.savedMovies, 'id');
      return moviesObj[movieId];
    },
    //--------------
    // Get the current posterURL and backgroundURL for the passed movieId
    getCurrentImageUrls: (state) => (movieId) => {
      let movies = state.savedMovies;

      for (let i = 0; i <= movies.length; i++) {
        if (movieId === movies[i].id) {
          // return the current image urls for this movies[i]
          return {
            currentPosterURL: movies[i].posterURL,
            currentBackdropURL: movies[i].backdropURL,
          };
        }
      }
      return {};
    },
    //--------------
    // Return tag object with all tags { tagId, tagName }
    getTags: (state) => state.tagData,
    //--------------
    getMovieTags: (state) => (movieId) => {
      let movieTags = helpers.retrieveMovieTagIds(state, movieId);
      // Since we are only storing the tagId, we need to
      // extract the tagName for the stored tagIds.
      // This helper function will do that
      return helpers.buildTagObjFromIds(state, movieTags, true);
    },
    //--------------
    getUnusedMovieTags: (state) => (movieId) => {
      let movieTagIds = helpers.retrieveMovieTagIds(state, movieId);
      let allTagIds = helpers.retrieveTagIds(state.getTags);

      let unusedTagIds = _.difference(allTagIds, movieTagIds);
      return helpers.buildTagObjFromIds(state, unusedTagIds, false);
    },
    //--------------
    getAllMovieTags: (state) => (movieId) => {
      return _.sortBy(
        [...state.getUnusedMovieTags(movieId), ...state.getMovieTags(movieId)],
        ['tagName']
      );
    },
    //--------------
    getFilterTags: (state) => {
      let filterTagIds = state.filterData.tags;
      return helpers.buildTagObjFromIds(state, filterTagIds, true);
    },
    //--------------
    getUnusedFilterTags: (state) => {
      let filterTagIds = state.filterData.tags;
      let allTagIds = helpers.retrieveTagIds(state.getTags);
      let unusedFilterTagIds = allTagIds.filter(
        (tagId) => !filterTagIds.find((tag) => tag === tagId)
      );
      return helpers.buildTagObjFromIds(state, unusedFilterTagIds, false);
    },
    //--------------
    getAllFilterTags: (state) => {
      return _.sortBy(
        [...state.getUnusedFilterTags, ...state.getFilterTags],
        ['tagName']
      );
    },
  },
  actions,
  effects,
};
