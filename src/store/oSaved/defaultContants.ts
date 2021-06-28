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
    id: "title",
    sortField: "title",
    title: "Title",
    sortDirection: "asc",
    active: true,
    type: "alpha",
    index: 1,
  },
  {
    id: "releasedate",
    sortField: "releaseDate.epoch",
    title: "Release Date",
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
