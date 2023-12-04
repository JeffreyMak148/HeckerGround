import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

const ContentProvider = ({children}) => {
    const [postId, setPostId] = useState(null);
    const [post, setPost] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [sort, setSort] = useState({sortBy: "id", sortOrder: "asc"});
    const value = {postId, setPostId, post, setPost, refresh, setRefresh, sort, setSort};
    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
};

function useContent() {
    const context = useContext(ContentContext);
    if(context === undefined) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
}

export { ContentProvider, useContent };

