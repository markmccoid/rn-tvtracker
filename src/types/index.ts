export type Operators = "AND" | "OR";
export type SortTypes = "alpha" | "num" | "date";
export type Datasource = "cloud" | "local" | undefined;

export type DateOptions = {
  epoch: number;
  formatted: string;
};

export type DateObject = {
  date?: Date;
  epoch: number;
  formatted: string;
};

export * from "./firestoreStructure";
export * from "./tmdbTypes";
