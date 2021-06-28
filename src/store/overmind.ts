import { createHook } from "overmind-react";
import { createOvermind } from "overmind";
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from "overmind-react";

import { IConfig, IOnInitialize, IContext } from "overmind";

// Due to circular typing we have to define an
// explicit typing of state, actions and effects since
// TS 3.9
export interface Config
  extends IConfig<{
    state: typeof config.state;
    actions: typeof config.actions;
    effects: typeof config.effects;
  }> {}

export interface OnInitialize extends IOnInitialize<Config> {}

export interface Context extends IContext<Config> {}

// Used with derived
export type RootState = Context["state"];
//* -----------------------------------------

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
export const overmind = createOvermind(config, { devtools: "192.168.1.27:3031" });