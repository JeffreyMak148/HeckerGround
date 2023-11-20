import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const value = {isLoggedIn, setIsLoggedIn, showLogin, setShowLogin, userProfile, setUserProfile, showProfile, setShowProfile};
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

function useUser() {
    const context = useContext(UserContext);
    if(context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export { UserProvider, useUser };
