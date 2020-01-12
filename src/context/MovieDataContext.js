import React, { useState, useContext, useEffect } from "react";

import { loadData } from "./storage";

const MovieDataStateContext = React.createContext();
const MovieDataSettersContext = React.createContext();

function MovieDataProvider({ children }) {
  let [savedMovies, setSavedMovies] = useState([]);

  useEffect(() => {
    let initData = async () => {
      let movies = await loadData();
      setSavedMovies(movies);
    };
    initData();
  }, []);
  let saveMovie = movieObj => {
    setSavedMovies([movieObj, ...savedMovies]);
  };

  return (
    <MovieDataStateContext.Provider value={{ savedMovies }}>
      <MovieDataSettersContext.Provider value={{ saveMovie }}>
        {children}
      </MovieDataSettersContext.Provider>
    </MovieDataStateContext.Provider>
  );
}

/**======================================================
 * savedMovies State
 *
 * useMoviesState()
 *  Returns and object with the Variable state
 *   { savedMovies }
 *
 * Just a helper hook so that the user doesn't
 * need to import the MovieDataStateContext and useContext
 */
export const useMovieState = () => {
  const context = useContext(MovieDataStateContext);
  if (context === undefined) {
    throw new Error(
      "useMovieState must be used within a MovieDataStateContext"
    );
  }
  return context;
};

/**======================================================
 * savedMovies State
 *
 * useMoviesState()
 *  Returns and object with the Variable state
 *   { savedMovies }
 *
 * Just a helper hook so that the user doesn't
 * need to import the MovieDataStateContext and useContext
 */
export const useMovieActions = () => {
  const context = useContext(MovieDataSettersContext);
  if (context === undefined) {
    throw new Error(
      "useMovieActions must be used within a MovieDataSettersContext"
    );
  }
  return context;
};

export default MovieDataProvider;
