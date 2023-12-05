import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface LoginContextProps {
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
    const [showLogin, setShowLogin] = useState<boolean>(false);

    const value: LoginContextProps = { showLogin, setShowLogin };

    return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
};

function useLogin(): LoginContextProps {
    const context = useContext(LoginContext);
    if(context === undefined) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
}

export { LoginProvider, useLogin };

