import React, { createContext, useContext, useState } from 'react';

const LoginContext = createContext();

const LoginProvider = ({children}) => {
    const [showLogin, setShowLogin] = useState(false);
    const value = {showLogin, setShowLogin};
    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
};

function useLogin() {
    const context = useContext(LoginContext);
    if(context === undefined) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
}

export { LoginProvider, useLogin };
