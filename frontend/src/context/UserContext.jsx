// import React, { createContext, useContext } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getUser } from '../api/auth';

// // Create the context
// const UserContext = createContext();

// // Create the provider component
// export const UserProvider = ({ children }) => {
//   const { data, isLoading, isError, error } = useQuery('user', getUser);

//   return (
//     <UserContext.Provider value={{ user: data, isLoading, isError, error }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Custom hook to use the user context
// export const useUser = () => {
//   return useContext(UserContext);
// };
