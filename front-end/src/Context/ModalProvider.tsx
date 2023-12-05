import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface Popup {
    popupId: number;
    popupHeader: string;
    popupBody: string;
    popupType: string;
}

interface CommentModal {
    commentId: null | number;
    show: boolean;
}

interface CreateCommentModal {
    postId: null | number;
    replyComment: null | any; // Replace 'any' with the actual type of replyComment if available
    show: boolean;
}

interface CreatePostModal {
    show: boolean;
}

interface ProfileModal {
    profileId: null | number;
    from: null | string;
    show: boolean;
}

interface ModalContextProps {
    createCommentModal: CreateCommentModal; // Replace 'any' with the actual type of replyComment if available
    setCreateCommentModal: React.Dispatch<React.SetStateAction<CreateCommentModal>>;
    createPostModal: CreatePostModal;
    setCreatePostModal: React.Dispatch<React.SetStateAction<CreatePostModal>>;
    commentModal: CommentModal;
    setCommentModal: React.Dispatch<React.SetStateAction<CommentModal>>;
    profileModal: ProfileModal;
    setProfileModal: React.Dispatch<React.SetStateAction<ProfileModal>>;
    popupModal: Popup[];
    setPopupModal: React.Dispatch<React.SetStateAction<Popup[]>>;
    showPopup: (popupHeader: string, popupBody: string) => void;
    showErrorPopup: (popupHeader: string, popupBody: string) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const ModalProvider = ({ children }: PropsWithChildren<{}>) => {
    const [createCommentModal, setCreateCommentModal] = useState<CreateCommentModal>({ show: false, postId: null, replyComment: null });
    const [createPostModal, setCreatePostModal] = useState<CreatePostModal>({ show: false });
    const [commentModal, setCommentModal] = useState<CommentModal>({ show: false, commentId: null });
    const [profileModal, setProfileModal] = useState<ProfileModal>({ show: false, profileId: null, from: null });
    const [popupModal, setPopupModal] = useState<Popup[]>([]);

    const showErrorPopup = (popupHeader: string, popupBody: string) => {
        setPopupModal(popUpModal => ([...popUpModal, {
            popupId: popUpModal.length, 
            popupHeader: popupHeader, 
            popupBody: popupBody,
            popupType: "error"
        }]));
        return;
    }

    const showPopup = (popupHeader: string, popupBody: string) => {
        setPopupModal(popUpModal => ([...popUpModal, {
            popupId: popUpModal.length, 
            popupHeader: popupHeader, 
            popupBody: popupBody,
            popupType: "popup"
        }]));
        return;
    }

    const value: ModalContextProps = {
        createCommentModal, setCreateCommentModal, 
        createPostModal, setCreatePostModal, 
        commentModal, setCommentModal, 
        profileModal, setProfileModal, 
        popupModal, setPopupModal,
        showPopup, showErrorPopup
    };
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
};

function useModal(): ModalContextProps {
    const context = useContext(ModalContext);
    if(context === undefined) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}

export { ModalProvider, useModal };
