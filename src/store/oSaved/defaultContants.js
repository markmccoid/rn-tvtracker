export const defaultSort = [
  {
    sortField: "userRating",
    title: "User Rating",
    sortDirection: "desc",
    active: true,
    type: "num",
  },
  { sortField: "title", title: "Title", sortDirection: "asc", active: true, type: "alpha" },
  {
    sortField: "releaseDate.epoch",
    title: "Release Date",
    sortDirection: "desc",
    active: false,
    type: "date",
  },
];
