import { MdOutlineInsertComment } from "react-icons/md";



import { useContent } from '../../Context/ContentProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import { CommentData } from '../Content';
import "./CreateCommentButton.css";

type CreateCommentButtonProps = {
    reply?: CommentData;
}

export const CreateCommentButton = ({reply}: CreateCommentButtonProps): JSX.Element => {
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
                    <button className="reply-comment-button" onClick={handleShowCreateComment}><MdOutlineInsertComment size="1.1em" /></button>
                :
                    <button className="new-comment-button" onClick={handleShowCreateComment}><MdOutlineInsertComment size="1.1em"/></button>
            }
        </>
    );
};