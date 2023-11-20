import React, { createContext, useContext, useState } from 'react';

const TopicContext = createContext();

const TopicProvider = ({children}) => {
    const [selectedCatId, setSelectedCatId] = useState(null);
    const [category, setCategory] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [notification, setNotification] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const [bookmark, setBookmark] = useState(false);
    const [bookmarkId, setBookmarkId] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const value = {
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

function useTopic() {
    const context = useContext(TopicContext);
    if(context === undefined) {
        throw new Error("useTopic must be used within a TopicProvider");
    }
    return context;
}

export { TopicProvider, useTopic };

