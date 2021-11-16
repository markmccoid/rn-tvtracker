import React, { useState, useContext } from "react";

const PositionsObjContext = React.createContext();
const PositionsSettersContext = React.createContext();

/**======================================================
 * Provider function
 * This function is also where all the state is created
 */
function PositionsProvider({ children, positions }) {
  return (
    <PositionsObjContext.Provider value={positions}>{children}</PositionsObjContext.Provider>
  );
}

export const usePositions = () => {
  const context = useContext(PositionsObjContext);
  if (context === undefined) {
    throw new Error("PositionsObjContext must be used within a PositionsProvider");
  }
  return context;
};
// export const useVariableStateSetters = () => { ... }

export default PositionsProvider;
