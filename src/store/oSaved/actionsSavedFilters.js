import uuidv4 from 'uuid/v4';

export const addSavedFilter = ({ state, actions, effects }, savedFilterObj) => {
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
