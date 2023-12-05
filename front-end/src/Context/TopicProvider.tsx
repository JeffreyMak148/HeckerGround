import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface TopicContextProps {
    selectedCatId: null | number;
    setSelectedCatId: React.Dispatch<React.SetStateAction<null | number>>;
    category: null | any; // Replace 'any' with the actual type of category if available
    setCategory: React.Dispatch<React.SetStateAction<null | any>>;
    profileId: null | number;
    setProfileId: React.Dispatch<React.SetStateAction<null | number>>;
    profileUser: null | any; // Replace 'any' with the actual type of profileUser if available
    setProfileUser: React.Dispatch<React.SetStateAction<null | any>>;
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    notification: boolean;
    setNotification: React.Dispatch<React.SetStateAction<boolean>>;
    notificationId: null | number;
    setNotificationId: React.Dispatch<React.SetStateAction<null | number>>;
    bookmark: boolean;
    setBookmark: React.Dispatch<React.SetStateAction<boolean>>;
    bookmarkId: null | number;
    setBookmarkId: React.Dispatch<React.SetStateAction<null | number>>;
}

const TopicContext = createContext<TopicContextProps | undefined>(undefined);

const TopicProvider = ({ children }: PropsWithChildren<{}>) => {
    const [selectedCatId, setSelectedCatId] = useState<null | number>(null);
    const [category, setCategory] = useState<null | any>(null); // Replace 'any' with the actual type of category if available
    const [profileId, setProfileId] = useState<null | number>(null);
    const [profileUser, setProfileUser] = useState<null | any>(null); // Replace 'any' with the actual type of profileUser if available
    const [refresh, setRefresh] = useState<boolean>(false);
    const [notification, setNotification] = useState<boolean>(false);
    const [notificationId, setNotificationId] = useState<null | number>(null);
    const [bookmark, setBookmark] = useState<boolean>(false);
    const [bookmarkId, setBookmarkId] = useState<null | number>(null);

    const value: TopicContextProps = {
        selectedCatId, setSelectedCatId, 
        category, setCategory, 
        profileId, setProfileId, 
        profileUser, setProfileUser, 
        refresh, setRefresh, 
        notification, setNotification, 
        notificationId, setNotificationId, 
        bookmark, setBookmark, 
        bookmarkId, setBookmarkId
    };
    return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
};

function useTopic(): TopicContextProps {
    const context = useContext(TopicContext);
    if(context === undefined) {
        throw new Error("useTopic must be used within a TopicProvider");
    }
    return context;
}

export { TopicProvider, useTopic };

