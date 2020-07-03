import uuidv4 from 'uuid/v4';

export const addSavedFilter = ({ state, actions, effects }, savedFilterObj) => {
  // Add id using uuid
  savedFilterObj = { id: uuidv4(), ...savedFilterObj };
  // push onto current saved filters
  state.oSaved.savedFilters.push(savedFilterObj);

  // Save to Firebase
  effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
};

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
