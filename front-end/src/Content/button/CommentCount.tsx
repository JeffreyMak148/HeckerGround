import { FaCommentDots } from "react-icons/fa";
import { useModal } from '../../Context/ModalProvider';
import "./CommentCount.css";

type CommentCountProps = Readonly<{
    count: number;
    commentId: number;
}>;


export const CommentCount = ({count, commentId}: CommentCountProps): JSX.Element => {

    const modal = useModal();

    const changeCommentId = () => {
        if(!!commentId) {
            modal.setCommentModal(commentModal => ({...commentModal, commentId: commentId}));
        }
    }

    return (
        <>
            {
                count > 0 &&
                <>
                    <div>
                        <button className="comment-count-button" onClick={changeCommentId}><FaCommentDots size="0.8em" /><div className="comment-count-number">{count}</div></button>
                    </div>
                </>
            }
        </>
    );
};