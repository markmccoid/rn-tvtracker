import { createHook } from "overmind-react";
import { merge, namespaced } from "overmind/config";
import { config as oSearch } from "./oSearch";
import { config as oSaved } from "./oSaved";
import { config as oAdmin } from "./oAdmin";
// export const config = merge(
//   {
//     overLord: "mm"
//   },
//   namespaced({
//     oSearch,
//     oSaved
//   })
// );
export const config = namespaced({ oAdmin, oSearch, oSaved });
export const useOvermind = createHook();
