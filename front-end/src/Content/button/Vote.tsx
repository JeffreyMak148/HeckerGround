import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import { useContent } from '../../Context/ContentProvider';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import { CommentData } from "../Content";
import { VoteCountBar } from '../bar/VoteCountBar';
import "./Vote.css";

type VoteProps = {
    comment: CommentData;
}

export const Vote = ({comment}: VoteProps): JSX.Element => {
    const loadingBar = useLoading();
    const modal = useModal();
    const content = useContent();
    const user = useUser();

    
    function upvoteComment(id: number) {
        if(!!id && !loadingBar.backgroundLoading) {
            if(!user.isLoggedIn) {
                user.setShowLogin(true);
                return;
            }
            loadingBar.setBackgroundLoading(true);
            fetchUtil(`/api/comments/upvote/${id}`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                if(status === 200) {
                    content.setRefresh(true);
                } else if(status === 401) {
                    user.setIsLoggedIn(false);
                    user.setShowLogin(true);
                }
            }).then(() => {
                content.setRefresh(true);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);                
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false);
            });
        }
    }

    function downvoteComment(id: number) {
        if(!!id && !loadingBar.backgroundLoading) {
            if(!user.isLoggedIn) {
                user.setShowLogin(true);
                return;
            }
            loadingBar.setBackgroundLoading(true);
            fetchUtil(`/api/comments/downvote/${id}`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                if(status === 200) {
                    content.setRefresh(true);
                } else if(status === 401) {
                    user.setIsLoggedIn(false);
                    user.setShowLogin(true);
                }
            }).then(() => {
                content.setRefresh(true);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false);
            });
        }
    }

    function isDisabled(comment: CommentData) {
        return comment.downvoted || comment.upvoted;
    }
    

    return (
        <div className="comment-vote-div">
            <button className={`comment-upvote-button${isDisabled(comment) ? ' disabled' : ' abled'}${comment.upvoted ? ' selected' : ''}`} disabled={isDisabled(comment)} onClick={() => upvoteComment(comment.id)}><BiSolidUpvote size="0.8em"/><div className="comment-upvote-count">{comment.upvote}</div></button>
            <button className={`comment-downvote-button${isDisabled(comment) ? ' disabled' : ' abled'}${comment.downvoted ? ' selected' : ''}`} disabled={isDisabled(comment)} onClick={() => downvoteComment(comment.id)}><BiSolidDownvote size="0.8em"/><div className="comment-downvote-count">{comment.downvote}</div></button>
            <VoteCountBar upvoteCount={comment.upvote} downvoteCount={comment.downvote} upvoted={comment.upvoted} downvoted={comment.downvoted} />
        </div>
    );
};