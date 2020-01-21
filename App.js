import React from "react";
import { createAppContainer } from "react-navigation";
import { initTMDB } from "tmdb_api";
import { config } from "./src/store/overmind";
import { Provider } from "overmind-react";
import { createOvermind } from "overmind";
import MainTabNavigator from "./src/navigators/MainTabNavigator";

const App = createAppContainer(MainTabNavigator);

export default () => {
  initTMDB("0e4935aa81b04539beb687d04ff414e3");
  // let loadMovies = useMovieStore(state => state.loadMovies);
  // loadMovies();
  const overmind = createOvermind(config, { devtools: "192.168.1.22:3031" });

  return (
    <Provider value={overmind}>
      <App />
    </Provider>
  );
};
