import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

const ErrorProvider = ({children}) => {
    const [error, setError] = useState(null);
    const value = {error, setError};
    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
};

function useError() {
    const context = useContext(ErrorContext);
    if(context === undefined) {
        throw new Error("useError must be used within a ErrorProvider");
    }
    return context;
}

export { ErrorProvider, useError };
