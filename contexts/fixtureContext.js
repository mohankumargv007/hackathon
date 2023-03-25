import { createContext, useContext } from 'react';

const FixtureContext = createContext();

export function FixtureProvider({children, value}) {
  return (
    <FixtureContext.Provider value={value}>
      {children}
    </FixtureContext.Provider>
  );
}

export function useFixtureContext() {
  return useContext(FixtureContext);
}