import uuidv4 from "uuid/v4";
import _ from "lodash";

export const updateSavedFilterOrder = ({ state, actions, effects }, savedFilterArray) => {
  // Always saved filter array SORTED.
  // This sort is now done in the Drag and Sort.
  state.oSaved.savedFilters = _.sortBy(savedFilterArray, ["index"]).map((filter, index) => ({
    ...filter,
    index,
  }));

  // Save data to local
  effects.oSaved.localSaveSavedFilters(state.oAdmin.uid, state.oSaved.savedFilters);
};

/**
 * Will set whether or not to show the filter
 */
export const toggleFavSavedFilter = ({ state, actions, effects }, { id, isShown }) => {
  // This is an update.  Find the filter to update and update it.
  state.oSaved.savedFilters = state.oSaved.savedFilters.map((filter) => {
    if (filter.id === id) {
      return { ...filter, showInDrawer: !isShown };
    }
    return filter;
  });

  // Save data to local
  effects.oSaved.localSaveSavedFilters(state.oAdmin.uid, state.oSaved.savedFilters);
};
/**
 * addSavedFilter - Adds a new saved filter to the store and then store.
 * @param {*} param0
 * @param {object} savedFilterObj
 */
export const addSavedFilter = ({ state, actions, effects }, savedFilterObj) => {
  // If id is undefined, then add id using uuid
  // If id is NOT undefined, the assume updating existing filter.
  if (!savedFilterObj.id) {
    savedFilterObj = {
      ...savedFilterObj,
      id: uuidv4(),
      index: state.oSaved.savedFilters.length || 0,
    };
    // push onto current saved filters
    state.oSaved.savedFilters.push(savedFilterObj);
  } else {
    // This is an update.  Find the filter to update and update it.
    state.oSaved.savedFilters = state.oSaved.savedFilters.map((filter) => {
      if (filter.id === savedFilterObj.id) {
        return savedFilterObj;
      }
      return filter;
    });
  }
  // Save data to local
  effects.oSaved.localSaveSavedFilters(state.oAdmin.uid, state.oSaved.savedFilters);
};

/**
 * deleteSavedFilter - deletes the filter associated with the passed ID
 * @param {*} param0
 * @param {string} filterIdToDelete
 */
export const deleteSavedFilter = ({ state, actions, effects }, filterIdToDelete) => {
  // TODO Make sure this filter is not used in the side bar or as the default
  // TODO Delete Filter from Store
  // const savedFilters = state.oSaved.savedFilters;

  //# Sort savedFilters by index property
  const savedFilters = _.sortBy(state.oSaved.savedFilters, ["index"]);
  //# Delete the filter Id to Delete
  //# Reindex since array will now be in index order -- could optimize by only reindex after index of id deleted
  state.oSaved.savedFilters = savedFilters
    .filter((filter) => filter.id !== filterIdToDelete)
    .map((filter, index) => ({ ...filter, index }));

  // Save data to local
  effects.oSaved.localSaveSavedFilters(state.oAdmin.uid, state.oSaved.savedFilters);
};

//================================================================
//-Takes the passed savedFilterId, finds it and applies it
//-By applying it, I mean that oSaved.filterData is being set.
//- 12/21 - now if there is a sort key, that will be copied to currentSort
//-     if no sort key found, then defaultSort will be copied to currentSort
export const applySavedFilter = ({ state, actions }, savedFilterId) => {
  const {
    addTagToFilter,
    addExcludeTagToFilter,
    addGenreToFilter,
    setTagOperator,
    setExcludeTagOperator,
    setGenreOperator,
  } = actions.oSaved;

  //reset filter state
  state.oSaved.filterData.genres = [];
  state.oSaved.filterData.tags = [];
  state.oSaved.filterData.excludeTags = [];
  // reset sort state to default state.  This effectively resets the sort so if the saved filter
  // doesn't have a sort component, we will use the default sort
  state.oSaved.currentSort = [...state.oSaved.settings.defaultSort];
  //Filter for the passed id since this returns an array, just grab the first and only one
  const filterToApply = getFilterToApply(state.oSaved.savedFilters, savedFilterId);
  if (filterToApply.wasFound) {
    // Loop through and add each tag in the array to the filter
    filterToApply?.tags?.forEach((tagId) => addTagToFilter(tagId));
    filterToApply?.excludeTags?.forEach((tagId) => addExcludeTagToFilter(tagId));
    filterToApply?.genres?.forEach((genre) => addGenreToFilter(genre));
    // Add the tagOperator to the filter.
    setTagOperator(filterToApply?.tagOperator || "AND");
    setExcludeTagOperator(filterToApply?.excludeTagOperator || "OR");
    setGenreOperator(filterToApply?.genreOperator || "OR");
    if (filterToApply?.sort) {
      state.oSaved.currentSort = [...filterToApply.sort];
    }
  }
};

function getFilterToApply(savedFilters, filterId) {
  // If the filter exists return and initialized filter object
  const filterToApply = savedFilters.filter((sf) => filterId === sf.id)[0];
  if (filterToApply) {
    // add wasFound flag
    // Initialize all values in case some are not preset in saved filter
    return {
      wasFound: true,
      tags: [],
      excludeTags: [],
      tagOperator: "AND",
      excludeTagOperator: "OR",
      ...filterToApply,
    };
  }
  return { wasFound: false };
}
//--------------------------------------------
//- Set Default Filter -- oSaved.userData.settings.defaultFilter
export const setDefaultFilter = ({ state, actions, effects }, defaultFilter) => {
  const userSettings = state.oSaved.settings;
  state.oSaved.settings = {
    ...userSettings,
    defaultFilter: defaultFilter ? defaultFilter : null,
  };

  // Save data to local
  effects.oSaved.localSaveSettings(state.oAdmin.uid, state.oSaved.settings);
};
