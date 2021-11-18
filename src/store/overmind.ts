import { createHook } from "overmind-react";
import { createOvermind } from "overmind";
import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook,
} from "overmind-react";

import { IConfig, IOnInitialize, IContext } from "overmind";

// import { IContext } from 'overmind'

// export type Context = IContext<typeof config>;

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

export const config = namespaced({ oAdmin, oSaved, oSearch });
export const useOvermind = createHook();
export const useOState = createStateHook<Config>();
export const useOActions = createActionsHook<Config>();
export const useOEffects = createEffectsHook<Config>();
export const useOReaction = createReactionHook<Config>();

const devToolsConfig =
  process.env.NODE_ENV === "development" ? { devtools: "192.168.1.25:3031" } : {};
export const overmind = createOvermind(config, devToolsConfig);
// export const overmind = createOvermind(config, { devtools: "192.168.1.25:3031" });
