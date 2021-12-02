import { SortTypes } from "../../types";

export type SortObjectItem = {
  id: number;
  active: boolean;
  index: number;
  sortDirection: "asc" | "desc";
};

export type SortDefinitionDetails = {
  sortField: string;
  subSortField?: string;
  title: string;
  type: SortTypes;
};

export type FullSortObject = SortObjectItem & SortDefinitionDetails;

export type SortDefinitions = {
  [key: number]: SortDefinitionDetails;
};

export const sortDefinitions: SortDefinitions = {
  0: {
    sortField: "userRating",
    title: "User Rating",
    type: "num",
  },
  1: {
    sortField: "name",
    title: "Name",
    type: "alpha",
  },
  2: {
    sortField: "lastAirDate",
    subSortField: "epoch",
    title: "Last Aired",
    type: "date",
  },
  3: {
    sortField: "dateSaved",
    title: "Saved Date",
    type: "date",
  },
  4: {
    sortField: "nextAirDate",
    subSortField: "epoch",
    title: "Next Airing",
    type: "date",
  },
  5: {
    sortField: "episodeRunTimeGroup",
    title: "Episode Length",
    type: "num",
  },
};

export const defaultSort: SortObjectItem[] = [
  {
    // title: "User Rating",
    id: 0,
    sortDirection: "desc",
    active: true,
    index: 0,
  },
  {
    // title: "Name",
    id: 1,
    sortDirection: "asc",
    active: true,
    index: 1,
  },
  {
    // title: "Last Air Date",
    id: 2,
    sortDirection: "desc",
    active: false,
    index: 2,
  },
  {
    // title: "Saved Date",
    id: 3,
    sortDirection: "desc",
    active: false,
    index: 3,
  },
  {
    // title: "Next Air Date",
    id: 4,
    sortDirection: "desc",
    active: false,
    index: 4,
  },
  {
    // title: "Episode Run Time Group",
    id: 5,
    sortDirection: "desc",
    active: false,
    index: 5,
  },
];
