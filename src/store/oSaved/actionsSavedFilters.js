import uuidv4 from 'uuid/v4';

export const addSavedFilter = ({ state, actions, effects }, savedFilterObj) => {
  console.log('IN addsavedFilter');
  // Add id using uuid
  savedFilterObj = { id: uuidv4(), ...savedFilterObj };
  // push onto current saved filters
  state.oSaved.savedFilters.push(savedFilterObj);

  // Save to Firebase
  effects.oSaved.saveSavedFilters(state.oSaved.savedFilters);
};

export const deleteSavedFilter = (
  { state, actions, effects },
  savedFilterId
) => {
  // TODO Make sure this filter is not used in the side bar or as the default
  // TODO Delete Filter from Store
  // TODO Store new set of saved filters to Firebase
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
