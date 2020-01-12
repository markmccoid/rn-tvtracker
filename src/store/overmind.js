import { createHook } from "overmind-react";
import { merge, namespaced } from "overmind/config";
import { config as oSearch } from "./oSearch";
import { config as oSaved } from "./oSaved";

// export const config = merge(
//   {
//     overLord: "mm"
//   },
//   namespaced({
//     oSearch,
//     oSaved
//   })
// );
export const config = namespaced({ oSearch, oSaved });
export const useOvermind = createHook();
