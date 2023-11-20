import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { HiReply } from "react-icons/hi";
import { useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import { useUser } from '../Context/UserProvider';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import ResizeableDiv from '../util/ResizeableDiv';
import fetchUtil from '../util/fetchUtil';
import renderHtml from '../util/renderHtml';
import "./CreateComment.css";

const CreateComment = () => {

    // const [inputComment, setInputComment] = useState("");
    const [html, setHTML] = useState("");
    const [text, setText] = useState("");
    const [imageSrcs, setImageSrcs] = useState([]);
    const [empty, setEmpty] = useState(true);
    const [curHeight, setCurHeight] = useState(480);
    const user = useUser();
    const modal = useModal();
    const content = useContent();
    const topic = useTopic();
    const postId = content.postId;
    const loadingBar = useLoading();

    const handleHideCreateComment = () => {
        modal.setCreateCommentModal({show: false, postId: null, replyComment: null});
        setHTML("");
        setText("");
        setImageSrcs([]);
        setEmpty(true);
    }

    function createComment () {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        }

        if(empty) {
            return;
        }

        const reqBody = {
            encodedPostId: modal.createCommentModal.postId,
            content: html,
            plainText: text,
            replyCommentId: !!modal.createCommentModal.replyComment ? modal.createCommentModal.replyComment.id : null,
            imageSrcs: imageSrcs
        }

        if(!loadingBar.backgroundLoading) {
            loadingBar.setBackgroundLoading(true);
            fetchUtil(`/api/comments/${postId}`, reqBody, "POST")
            .then(({status, data}) => {
                if(status === 200) {
                    handleHideCreateComment();
                    content.setRefresh(true);
                } else if(status === 401) {
                    user.setIsLoggedIn(false);
                    user.setShowLogin(true);
                }
            })
            .catch(error => {
                modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false);
            });
        }
        
    }

    return (
        <div>
            {
            modal.createCommentModal.show ? 
                <div className="create-new-comment-container" style={{height: `${curHeight}px`}}>
                    <ResizeableDiv top={true} minHeight={180} maxHeight={window.innerHeight - 100} setCurHeight={setCurHeight}>
                        <div className="create-new-comment-container-inner">
                            <div className="create-comment-top">
                                <div className="flex-1">
                                    <span className="create-comment-category-text">{!!topic.category ? topic.category.find(c => c.catId === parseInt(content.post.catId)).category : ""}</span> - Create New Comment
                                </div>
                                <div className="flex-display">
                                    <button className="create-comment-button" id="submit" type="button" onClick={() => createComment()}>
                                        <HiReply size="1.5em"/>
                                    </button>
                                </div>
                                <div className="close-button-div" onClick={handleHideCreateComment}>
                                    <AiOutlineClose size="1.5em" />
                                </div>
                            </div>
                            {
                                !!modal.createCommentModal.replyComment ?
                                <div className="create-comment-mid">
                                    <div className="create-comment-post-title"><span className="create-comment-reply-text">Reply to : </span>{content.post.title}</div>
                                    <div className="create-comment-reply-info">
                                        <span className="create-comment-user-id">#{modal.createCommentModal.replyComment.commentNumber}</span>
                                        <span className="create-comment-username">{modal.createCommentModal.replyComment.user.username}</span>
                                        <blockquote className="create-comment-quote">{renderHtml(modal.createCommentModal.replyComment.content)}</blockquote>
                                    </div>
                                </div>
                                :
                                <div className="create-comment-mid">
                                    <div className="create-comment-post-title"><span className="create-comment-reply-text">Reply to : </span>{content.post.title}</div>
                                </div>
                            }
                            <RichTextEditor setHTML={setHTML} setText={setText} setImageSrcs={setImageSrcs} setEmpty={setEmpty} />
                            {/* <textarea className="create-comment-input" wrap="soft" id="postComment" placeholder="Comment" value={inputComment} onChange={(e) => setInputComment(e.target.value)} /> */}
                        </div>
                    </ResizeableDiv>
                </div>
            : <></>
            }
        </div>
    );
};

export default CreateComment;