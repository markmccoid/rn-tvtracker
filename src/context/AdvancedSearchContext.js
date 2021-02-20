import React from "react";

const AdvancedSearchContext = React.createContext();

//*---------------------------------------
//* Exports a Context Provider, which accepts a snapPoint Object
//* The object will be spread into the value property
//*---------------------------------------
function AdvancedSearchProvider({ advancedSearchObject, children }) {
  return (
    <AdvancedSearchContext.Provider value={{ ...advancedSearchObject }}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}

//*---------------------------------------
//* Returns the snapPoint Object
//*---------------------------------------
export const useAdvancedSearchState = () => {
  const context = React.useContext(AdvancedSearchContext);
  if (context === undefined) {
    throw new Error("useAdvancedSearchState must be used within a AdvancedSearchProvider");
  }
  return context;
};

export default AdvancedSearchProvider;
