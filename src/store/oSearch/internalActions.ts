import _ from "lodash";
import { Config } from "../overmind";
import { TVSearchItem } from "../../types";

// -- INTERNAL ACTIONS --------------------------------
// -- These are actions that are used only by other actions.
// -- Meaning they are not called by external processes.
export const tagResults = (
  { state, effects }: Config,
  showsToTag: TVSearchItem[]
): TVSearchItem[] => {
  const { savedTVShows } = state.oSaved;
  let taggedShows: TVSearchItem[] = [];
  showsToTag.forEach((show) => {
    const foundShow = savedTVShows.find((savedShow) => savedShow.id === show.id);
    if (foundShow) {
      const foundSearchShow = { ...show, posterURL: foundShow.posterURL };
      taggedShows.push({ ...foundSearchShow, existsInSaved: true });
    } else {
      taggedShows.push({ ...show, existsInSaved: false });
    }
  });
  return taggedShows;
};
