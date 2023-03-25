import { createContext, useContext } from 'react';

const HomeContext = createContext();

export function HomeWrapper({children, value}) {
  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHomeContext() {
  return useContext(HomeContext);
}