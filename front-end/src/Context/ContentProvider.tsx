import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
export interface Sort {
    sortBy: string;
    sortOrder: string;
}
interface ContentContextProps {
    postId: null | string;
    setPostId: React.Dispatch<React.SetStateAction<null | string>>;
    post: null | any; // Replace 'any' with the actual type of post if available
    setPost: React.Dispatch<React.SetStateAction<null | any>>;
    refresh: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    sort: Sort;
    setSort: React.Dispatch<React.SetStateAction<Sort>>;
}
const ContentContext = createContext<ContentContextProps | undefined>(undefined);
const ContentProvider = ({ children }: PropsWithChildren<{}>) => {
    const [postId, setPostId] = useState<null | string>(null);
    const [post, setPost] = useState<null | any>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [sort, setSort] = useState<Sort>({ sortBy: "id", sortOrder: "asc" });

    const value: ContentContextProps = {postId, setPostId, post, setPost, refresh, setRefresh, sort, setSort};
    
    return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
};
function useContent(): ContentContextProps {
    const context = useContext(ContentContext);
    if(context === undefined) {
        throw new Error("useContent must be used within a ContentProvider");
    }
    return context;
}
export { ContentProvider, useContent };

