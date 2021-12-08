export const colors = {
  darkText: "#274315",
  splashGreenLight: "#84ee4b",
  splashGreenDark: "#578e2c",
  primary: "#59922D", //"#4285ec",
  buttonPrimary: "#7d9c66", //"#578e2c",
  buttonPrimaryText: "white",
  buttonPrimaryBorder: "#777",
  buttonTextDark: "#212121",
  background: "#d7ebdb", //"#ebf4ff", //#dee9f7",
  navHeaderColor: "#E4EBE9",
  imdbYellow: "#f6c418",
  dropboxBlue: "#0061fd",
  // background: "#f2f2f2",
  darkbg: "#59922D", //"#037aff", //"#005fcc", //"#2f6eb5", // Background used for buttons, etc
  darkfg: "white", // Foreground color to be used with darkbg
  excludeRed: "#a61000",
  mutedRed: "#CB4C4E",
  includeGreen: "#6cb043",
  tagListbg: "#EFF4FB",
  tagListfg: "black",
  listBorder: "#777",
  listItemBorder: "#ccc",
  listBackground: "white",
  listItemBackground: "white",
  commonBorder: "#777",
  episodeLengthGroup0: "orange",
  episodeLengthGroup1: "green",
  episodeLengthGroup2: "blue",
  episodeLengthGroup3: "red",
  canceled: "#CB4C4E",
  returning: "#59922D",
  ended: "#CB4C4E",
  nextAirDate: "#5657D6",
};

export const fonts = {
  sizes: {
    s: 16,
    m: 18,
    l: 20,
    xl: 22,
  },
  family: {
    primary: "Arial",
    seasons: "Optima",
    episodes: "Optima",
  },
};

export const styleHelpers = {
  debugBorders: {
    borderWidth: 1,
    borderColor: "red",
  },
  posterImageShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },
  buttonPrimary: {},
  buttonShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
};

export const commonStyles = {
  headerText: {
    fontSize: 18,
    fontWeight: "600",
  },
};

export const seasonConstants = {
  seasonHeaderHeight: 75,
  episodeHeight: 70,
};
