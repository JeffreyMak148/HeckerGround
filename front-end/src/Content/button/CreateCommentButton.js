import React from 'react';
import { BsChatRightDots } from "react-icons/bs";
import { useContent } from '../../Context/ContentProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import "./CreateCommentButton.css";

export const CreateCommentButton = ({reply}) => {
    const content = useContent();
    const user = useUser();
    const modal = useModal();
    const postId = content.postId;

    const handleShowCreateComment = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        } else {
            modal.setCreateCommentModal({show: true, postId: postId, replyComment: reply});
        }
    }

    return (
        <>
            {
                !!reply ?
                    <button className="reply-comment-button" onClick={handleShowCreateComment}><BsChatRightDots/></button>
                :
                    <>
                        <button className="new-comment-button" onClick={handleShowCreateComment}><BsChatRightDots/></button>
                    </>
            }
        </>
    );
};