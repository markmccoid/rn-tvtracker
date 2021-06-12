import { createHook } from "overmind-react";
import { createOvermind } from "overmind";
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from "overmind-react";
import { namespaced } from "overmind/config";
import { config as oSearch } from "./oSearch";
import { config as oSaved } from "./oSaved";
import { config as oAdmin } from "./oAdmin";

export const config = namespaced({ oAdmin, oSearch, oSaved });
export const useOvermind = createHook();
export const useOState = createStateHook();
export const useOActions = createActionsHook();
export const useOEffects = createEffectsHook();
export const useOReaction = createReactionHook();

// export const overmind = createOvermind(config);
export const overmind = createOvermind(config, { devtools: "192.168.1.26:3031" });
