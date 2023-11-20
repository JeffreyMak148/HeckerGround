import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

const ModalProvider = ({children}) => {
    const [createCommentModal, setCreateCommentModal] = useState({show: false, postId: null, replyComment: null});
    const [createPostModal, setCreatePostModal] = useState({show: false});
    const [commentModal, setCommentModal] = useState({show: false, commentId: null});
    const [profileModal, setProfileModal] = useState({show: false, profileId: null, from: null});
    const [errorModal, setErrorModal] = useState([]);
    const [uploadModal, setUploadModal] = useState({show: false});
    const value = {
        createCommentModal, setCreateCommentModal, 
        createPostModal, setCreatePostModal, 
        commentModal, setCommentModal, 
        profileModal, setProfileModal, 
        errorModal, setErrorModal,
        uploadModal, setUploadModal
    };
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
};

function useModal() {
    const context = useContext(ModalContext);
    if(context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}

export { ModalProvider, useModal };

