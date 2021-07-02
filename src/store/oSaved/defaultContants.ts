import { SortTypes } from "../../types";

export type SortObjectItem = {
  id: string;
  active: boolean;
  index: number;
  sortDirection: "asc" | "desc";
  sortField: string;
  title: string;
  type: SortTypes;
};

export const defaultSort: SortObjectItem[] = [
  {
    id: "userrating",
    sortField: "userRating",
    title: "User Rating",
    sortDirection: "desc",
    active: true,
    type: "num",
    index: 0,
  },
  {
    id: "name",
    sortField: "name",
    title: "Name",
    sortDirection: "asc",
    active: true,
    type: "alpha",
    index: 1,
  },
  {
    id: "firstairdate",
    sortField: "firstAirDate.epoch",
    title: "First Air Date",
    sortDirection: "desc",
    active: false,
    type: "date",
    index: 2,
  },
  {
    id: "saveddate",
    sortField: "savedDate",
    title: "Saved Date",
    sortDirection: "desc",
    active: false,
    type: "date",
    index: 3,
  },
];
