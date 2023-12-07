import { useState } from 'react';
import { useModal } from '../Context/ModalProvider';
import renderHtml from '../util/renderHtml';
import { CommentData } from './Content';
import "./ReplyComment.css";

type ReplyCommentProps = {
    replyComment?: CommentData;
    showCount: number;
}

export const ReplyComment = ({replyComment, showCount}: ReplyCommentProps): JSX.Element => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const modal = useModal();

    function changeCommentId() {
        if(!!replyComment) {
            modal.setCommentModal(commentModal => ({...commentModal, commentId: replyComment.id}));
        }
    }

    return (
        <>
            {
                !showMore && !!replyComment && showCount >= 0 ?
                    <>
                        <blockquote className="reply-comment-quote">
                            <div className="reply-comment-link" onClick={() => changeCommentId()}></div>
                            <ReplyComment replyComment={replyComment.replyComment} showCount={showCount-1}/>
                            {
                                showCount > 0 ?
                                    <div>{renderHtml(replyComment.content)}</div>
                                :
                                    <>
                                        {
                                            !showMore && <button className="show-more-button" onClick={() => {setShowMore(true)}}>Show More</button>
                                        }
                                    </>
                                    
                            }
                        </blockquote>
                    </>
                :
                <>
                    {
                        showMore && <><ReplyComment replyComment={replyComment} showCount={3}/></>
                    }
                </>
            }
        </>
    );
};