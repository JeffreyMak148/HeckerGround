import React from 'react';
import { BsBookmark } from "react-icons/bs";
import { useContent } from '../../Context/ContentProvider';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import "./BookmarkButton.css";

export const BookmarkButton = () => {
    const content = useContent();
    const loadingBar = useLoading();
    const modal = useModal();
    const user = useUser();

    const toggleBookmarkPost = () => {
        if(!!content.postId && !loadingBar.backgroundLoading) {
            if(!user.isLoggedIn) {
                user.setShowLogin(true);
                return;
            }
            loadingBar.setBackgroundLoading(true);
            fetchUtil(`/api/bookmarks/${content.postId}`, null, "POST")
            .then(({status, data, currentUser}) => {
                if(status === 200) {
                } else if(status === 401) {
                    user.setIsLoggedIn(false);
                    user.setShowLogin(true);
                }
                if(!!data) {
                    content.setPost(data.post);
                }
                if(!!currentUser) {
                    user.setUserProfile(currentUser);
                }
            }).then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false);
            });
        }
    }

    return (
        <div data-tooltip-id={`bookmark-tooltip`} data-tooltip-content="Bookmark" data-tooltip-place="top" title="Bookmark">
            <button className={`${content.post.bookmarked ? 'activated ' : ''}bookmark-button`} onClick={toggleBookmarkPost}><BsBookmark /></button>
        </div>
    );
};