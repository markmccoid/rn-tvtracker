import { movieSearchByTitle } from "@markmccoid/tmdb_api";

export const searchMovieByTitle = async (title, page = 1) => {
  let results = await movieSearchByTitle(title, page);
  return {
    data: results.data.results,
    totalPages: results.data.totalPages,
    currentPage: results.data.page
  };
};
