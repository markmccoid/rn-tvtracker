import "dotenv/config";
// import appjson from "./app.json";

// console.log("APP CONFIG CONTANTS", process.env.TMDB_ID);
const tmdbId = process.env.TMDB_ID;
export default {
  name: "TV Tracker",
  slug: "tv-tracker",
  scheme: "tvtracker",
  privacy: "unlisted",
  platforms: ["ios"],
  version: "0.2.01",
  orientation: "portrait",
  icon: "./assets/TVTrackerIcon.png",
  splash: {
    image: "./assets/TVTrackerSplash.png",
    resizeMode: "contain",
    backgroundColor: "#84ee4b",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: false,
    bundleIdentifier: "com.mccoidco.tvtracker",
    buildNumber: "0.2.01",
    infoPlist: {
      RCTAsyncStorageExcludeFromBackup: false,
    },
  },
  extra: {
    tmdbAPI: tmdbId,
  },
};
