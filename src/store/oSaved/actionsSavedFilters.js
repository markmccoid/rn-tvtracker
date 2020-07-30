import uuidv4 from "uuid/v4";
/**
 * addSavedFilter - Adds a new saved filter to the store and then stores it in Firebase.
 * @param {*} param0
 * @param {object} savedFilterObj
 */
export const addSavedFilter = ({ state, actions, effects }, savedFilterObj) => {
  // If id is undefined, then add id using uuid
  // If id is NOT undefined, the assume updating existing filter.
  if (!savedFilterObj.id) {
    savedFilterObj = { ...savedFilterObj, id: uuidv4() };
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

  // Save to Firebase
  effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
};

/**
 * updateSavedFilter - Updates an existing saved filter with the passed properties.
 * and then saves to Firebase
 * @param {*} param0
 * @param {ojbect} savedFilterObj
 */
export const updateSavedFilter = (
  { state, actions, effects },
  savedFilterObj
) => {
  // create a new array of filters with the passed object's filter updated
  const newFilters = state.oSaved.savedFilters.map((filterObj) => {
    if (filterObj.id === savedFilterObj.id) {
      return savedFilterObj;
    }
    return filterObj;
  });
  //Store back into Overmind
  state.oSaved.savedFilters = newFilters;
  // Save to Firebase
  effects.oSaved.saveSavedFilters(newFilters);
};

/**
 * deleteSavedFilter - deletes the filter associated with the passed ID and then udpates Firebase
 * @param {*} param0
 * @param {string} filterIdToDelete
 */
export const deleteSavedFilter = (
  { state, actions, effects },
  filterIdToDelete
) => {
  // TODO Make sure this filter is not used in the side bar or as the default
  // TODO Delete Filter from Store
  const savedFilters = state.oSaved.savedFilters;
  state.oSaved.savedFilters = savedFilters.filter(
    (filter) => filter.id !== filterIdToDelete
  );
  // Save to Firebase
  effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
};

//================================================================
//-Takes the passed savedFilterId, finds it and applies it
//-By applying it, I mean that oSaved.filterData is being set.
export const applySavedFilter = ({ state, actions }, savedFilterId) => {
  const { addTagToFilter, setTagOperator } = actions.oSaved;
  //Filter for the passed id since this returns an array, just grab the first and only one
  const filterToApply = state.oSaved.savedFilters.filter(
    (sf) => savedFilterId === sf.id
  )[0];
  // Loop through and add each tag in the array to the filter
  filterToApply.tags.forEach((tagId) => addTagToFilter(tagId));
  // Add the tagOperator to the filter.
  setTagOperator(filterToApply.tagOperator);
};

//--------------------------------------------
//- Set Default Filter -- oSaved.userData.settings.defaultFilter
export const setDefaultFilter = (
  { state, actions, effects },
  defaultFilter
) => {
  const userSettings = state.oSaved.settings;
  state.oSaved.settings = { ...userSettings, defaultFilter };
  //TODO create firebase function and store to firebase.
  effects.oSaved.saveSettings(state.oSaved.settings);
};
