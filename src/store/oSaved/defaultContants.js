export const defaultSort = [
  { sortField: "userRating", title: "User Rating", sortDirection: "desc", active: true },
  { sortField: "title", title: "Title", sortDirection: "asc", active: true },
  {
    sortField: "releaseDate.epoch",
    title: "Release Date",
    sortDirection: "desc",
    active: false,
  },
];
