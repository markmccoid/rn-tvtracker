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
    if (_.some(savedTVShows, { id: show.id })) {
      taggedShows.push({ ...show, existsInSaved: true });
    } else {
      taggedShows.push({ ...show, existsInSaved: false });
    }
  });
  return taggedShows;
};
