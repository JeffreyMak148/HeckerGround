import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { CurrentUser } from '../util/fetchUtil';

interface UserContextProps {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    showLogin: boolean;
    setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
    userProfile: null | CurrentUser;
    setUserProfile: React.Dispatch<React.SetStateAction<null | CurrentUser>>;
    showProfile: boolean;
    setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentUser: (currentUser: CurrentUser | undefined) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

const UserProvider = ({ children }: PropsWithChildren<{}>) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<null | CurrentUser>(null);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const setCurrentUser = (currentUser: CurrentUser | undefined) => {
        if (!!currentUser && currentUser.authenticated) {
            setIsLoggedIn(true);
            setUserProfile(currentUser);
        } else {
            setIsLoggedIn(false);
            setUserProfile(null);
        }
    };

    const value: UserContextProps = {
        isLoggedIn, setIsLoggedIn,
        showLogin, setShowLogin,
        userProfile, setUserProfile,
        showProfile, setShowProfile,
        setCurrentUser,
    };
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
};

function useUser(): UserContextProps {
    const context = useContext(UserContext);
    if(context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

export { UserProvider, useUser };

