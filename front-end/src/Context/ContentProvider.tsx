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
    hiddenCommentIds: number[];
    setHiddenCommentIds: React.Dispatch<React.SetStateAction<number[]>>;    
    toggleHiddenComment: (commentId: number) => void;
    isCommentHidden: (commentId: number) => boolean;
}

const ContentContext = createContext<ContentContextProps | undefined>(undefined);
const ContentProvider = ({ children }: PropsWithChildren<{}>) => {
    const [postId, setPostId] = useState<null | string>(null);
    const [post, setPost] = useState<null | any>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [sort, setSort] = useState<Sort>({ sortBy: "id", sortOrder: "asc" });
    const [hiddenCommentIds, setHiddenCommentIds] = useState<number[]>([]);

    const toggleHiddenComment = (commentId: number) => {
        if(!hiddenCommentIds.includes(commentId)) {
            setHiddenCommentIds(currentHiddenCommentIds => [...currentHiddenCommentIds, commentId]);
        } else {
            setHiddenCommentIds(currentHiddenCommentIds => {
                return currentHiddenCommentIds.filter(c => c !== commentId);
            })
        }
        return;
    }

    const isCommentHidden = (commentId: number): boolean => {
        return hiddenCommentIds.includes(commentId);
    }

    const value: ContentContextProps = {
        postId, setPostId, 
        post, setPost, 
        refresh, setRefresh, 
        sort, setSort, 
        hiddenCommentIds, setHiddenCommentIds, 
        toggleHiddenComment, isCommentHidden
    };
    
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

