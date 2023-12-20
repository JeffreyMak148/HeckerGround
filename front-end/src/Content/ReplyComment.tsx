import { useState } from 'react';
import { MdOutlineCommentsDisabled, MdOutlineOpenInFull } from 'react-icons/md';
import { useModal } from '../Context/ModalProvider';
import formatDate from '../util/formatDate';
import renderHtml from '../util/renderHtml';
import { CommentData } from './Content';
import "./ReplyComment.css";

type ReplyCommentProps = {
    hiddenCommentIds: number[];
    toggleHiddenComment: (commentId: number) => void;
    replyComment?: CommentData;
    showCount: number;
}

export const ReplyComment = ({hiddenCommentIds, toggleHiddenComment, replyComment, showCount}: ReplyCommentProps): JSX.Element => {
    const [showMore, setShowMore] = useState<boolean>(false);
    const [hide, setHide] = useState<boolean>(true);
    const modal = useModal();

    function changeCommentId() {
        if(!!replyComment) {
            modal.setCommentModal(commentModal => ({...commentModal, hiddenCommentIds: hiddenCommentIds, commentId: replyComment.id}));
        }
    }

    return (
        <>
            {
                !showMore && !!replyComment && showCount >= 0 ?
                    <>
                        <blockquote className="reply-comment-quote">
                            <div className="reply-comment-link" onClick={() => changeCommentId()}></div>
                            <ReplyComment hiddenCommentIds={hiddenCommentIds} toggleHiddenComment={toggleHiddenComment} replyComment={replyComment.replyComment} showCount={showCount-1}/>
                            {
                                hiddenCommentIds.includes(replyComment.id) ? 
                                    <>
                                        {
                                            hide ?
                                                <button className="reply-comment-expand" onClick={() => {setHide(false)}}>
                                                    <span className="reply-comment-comment-number">
                                                        #{replyComment.commentNumber}
                                                    </span>
                                                    <span className="reply-comment-username">
                                                        {replyComment.user.username}
                                                    </span>
                                                    <span className="reply-comment-date">
                                                        {formatDate(replyComment.createDateTime)}
                                                    </span>
                                                    <span className="reply-comment-expand-button">
                                                        <MdOutlineOpenInFull size="1.1em" />
                                                    </span>
                                                </button>
                                            :
                                                <>
                                                    <button className="reply-comment-expand" onClick={() => {setHide(true)}}>
                                                        <span className="reply-comment-comment-number">
                                                            #{replyComment.commentNumber}
                                                        </span>
                                                        <span className="reply-comment-username">
                                                            {replyComment.user.username}
                                                        </span>
                                                        <span className="reply-comment-date">
                                                            {formatDate(replyComment.createDateTime)}
                                                        </span>
                                                        <span className="reply-comment-expand-button">
                                                            <MdOutlineCommentsDisabled size="1.1em" />
                                                        </span>
                                                    </button>
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
                                                </>
                                        }
                                    </>
                                :
                                    <>
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
                                    </>
                            }
                        </blockquote>
                    </>
                :
                <>
                    {
                        showMore && <><ReplyComment hiddenCommentIds={hiddenCommentIds} toggleHiddenComment={toggleHiddenComment} replyComment={replyComment} showCount={3}/></>
                    }
                </>
            }
        </>
    );
};