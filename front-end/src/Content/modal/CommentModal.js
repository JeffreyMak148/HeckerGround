import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AiOutlineClose } from "react-icons/ai";
import { Tooltip } from 'react-tooltip';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import formatDate, { formatFullDate } from '../../util/formatDate';
import renderHtml from '../../util/renderHtml';
import { ReplyComment } from '../ReplyComment';
import { CommentCount } from '../button/CommentCount';
import { CreateCommentButton } from '../button/CreateCommentButton';
import { ShareButton } from '../button/ShareButton';
import { Vote } from '../button/Vote';
import "./CommentModal.css";

export const CommentModal = () => {

    const [comment, setComment] = useState(null);
    const [replyComments, setReplyComments] = useState(null);
    const modal = useModal();
    const user = useUser();

    const handleClose = () => {
        modal.setCommentModal(commentModal => ({commentId: null, show: false}))
    };

    useEffect(() => {
        if(!!modal.commentModal.commentId) {
            fetchUtil(`/api/comments/${modal.commentModal.commentId}`, "GET", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                setComment(data.comment);
                setReplyComments(data.replyComments);
                modal.setCommentModal(commentModal => ({...commentModal, show: true}));
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
        }

    }, [modal.commentModal.commentId]);

    function showProfileModal(profileId) {
        if(!!profileId) {
            modal.setProfileModal(profileModal => ({...profileModal, profileId: profileId}));
        }
    }

    return (
        <>
            <Modal centered dialogClassName="comment-modal-dialog fadeIn" contentClassName="comment-modal-content content-overflow" show={modal.commentModal.show} enforceFocus={false} onHide={handleClose} animation={false}>
                <Modal.Body className="comment-modal-body">
                    <div className="comment-modal-top">
                    </div>
                    <div className="comment-modal-close-button-div">
                        <button className="comment-modal-close-button" onClick={handleClose}><AiOutlineClose size="1.2em" /></button>
                    </div>
                    <div className="comment-modal-mid">
                        {
                            comment &&
                                <div key={comment.id}>
                                    <div className="flex-display margin-bottom-1">
                                        <div className="comment-modal-comment-number">
                                            #{comment.commentNumber}
                                        </div>
                                        <div className="comment-modal-comment-username" onClick={() => showProfileModal(comment.user.id)}>
                                            {comment.user.username}
                                        </div>
                                        <div className="comment-modal-comment-date" data-tooltip-id="comment-modal-date-tooltip" data-tooltip-content={formatFullDate(comment.createDateTime)} data-tooltip-place="top" title={formatFullDate(comment.createDateTime)}>
                                            {formatDate(comment.createDateTime)}
                                        </div>
                                        <div className="comment-modal-comment-button" data-tooltip-id="comment-modal-reply-tooltip" data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                            <CreateCommentButton reply={comment} />
                                        </div>
                                        <div className="comment-modal-share-button" data-tooltip-id="comment-modal-share-tooltip" data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                            <ShareButton postId={comment.post.id} commentNum={comment.commentNumber} title={comment.post.title} commentModal={true}/>
                                        </div>
                                        <div></div>
                                    </div>
                                    <ReplyComment replyComment={comment.replyComment} showCount={3}/>
                                    <div className="comment-modal-comment-content">
                                        {renderHtml(comment.content)}
                                    </div>
                                    <div className="flex-display">
                                        <div className="comment-modal-vote-div">
                                            <Vote comment={comment} />
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="reply-text">Replied</div>
                    <div className="comment-modal-bottom">                        
                        {
                            replyComments && replyComments.map((data, index) => {
                                return <div className="comment-modal-reply" key={data.id}>
                                    <div className="flex-display">
                                        <div className="comment-modal-reply-number">
                                            #{data.commentNumber}
                                        </div>
                                        <div className="comment-modal-reply-username" onClick={() => showProfileModal(data.user.id)}>
                                            {data.user.username}
                                        </div>
                                        <div className="comment-modal-reply-date" data-tooltip-id="comment-modal-date-tooltip" data-tooltip-content={formatFullDate(data.createDateTime)} data-tooltip-place="top" title={formatFullDate(data.createDateTime)}>
                                            {formatDate(data.createDateTime)}
                                        </div>
                                        <div className="comment-modal-reply-button" data-tooltip-id="comment-modal-reply-tooltip" data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                            <CreateCommentButton reply={data}/>
                                        </div>
                                        <div className="comment-modal-share-button" data-tooltip-id="comment-modal-share-tooltip" data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                            <ShareButton postId={data.post.id} commentNum={data.commentNumber} title={data.post.title} commentModal={true}/>
                                        </div>
                                        <div></div>
                                    </div>
                                    <div className="comment-modal-reply-content">
                                        {renderHtml(data.content)}
                                    </div>
                                    <div className="flex-display">
                                        <div className="comment-modal-reply-vote-div">
                                            <Vote comment={data} />
                                        </div>
                                        {
                                            data.numberOfReply > 0 &&
                                            <div className="comment-modal-comment-count">
                                                <CommentCount count={data.numberOfReply} commentId={data.id}/>
                                            </div>
                                        }
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="fin-text">Fin</div>
                    <Tooltip id="comment-modal-date-tooltip" className="comment-modal-tooltip" clickable={true}/>
                    <Tooltip id="comment-modal-reply-tooltip" className="comment-modal-tooltip" clickable={true}/>
                    <Tooltip id="comment-modal-share-tooltip" className="comment-modal-tooltip" clickable={true}/>
                </Modal.Body>
            </Modal>
        </>
    );
};