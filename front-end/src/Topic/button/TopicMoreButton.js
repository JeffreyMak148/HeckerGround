import { useRef, useState } from 'react';
import { MdChecklistRtl, MdDeleteForever, MdMoreVert } from "react-icons/md";


import { Overlay, Popover } from 'react-bootstrap';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useTopic } from '../../Context/TopicProvider';
import { useUser } from '../../Context/UserProvider';
import { CategoryConstant } from "../../constant";
import fetchUtil from '../../util/fetchUtil';
import "./TopicMoreButton.css";

export const TopicMoreButton = ({currentTopic}) => {
    const [show, setShow] = useState(false);
    const showMoreButtonCategory = [
        CategoryConstant.CATEGORY_TITLE_NOTIFICATIONS, 
        CategoryConstant.CATEGORY_TITLE_BOOKMARKS
    ];

    const topic = useTopic();
    const target = useRef(null);
    const loadingBar = useLoading();
    const user = useUser();
    const modal = useModal();

    const deleteAllNotificationOption = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
            return;
        }

        if(!loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            setShow(false);
            fetchUtil(`/api/notifications/delete/all`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
            })
            .then(() => {
                topic.setRefresh(true);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        }
    };

    const readAllNotificationOption = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
            return;
        }

        if(!loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            setShow(false);
            fetchUtil(`/api/notifications/read/all`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
            })
            .then(() => {
                topic.setRefresh(true);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        }
    };

    const deleteAllBookmarkOption = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
            return;
        }

        if(!loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            setShow(false);
            fetchUtil(`/api/bookmarks/delete/all`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
            })
            .then(() => {
                topic.setRefresh(true);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        }
    }

    const notificationsShowMore = (
        <>
            <button onClick={readAllNotificationOption} className="flex-display read-notifications-button">
                <MdChecklistRtl size="1.2em" />
                <span className="popover-text">Mark all notifications as read</span>
            </button>
            <button onClick={deleteAllNotificationOption} className="flex-display delete-notifications-button">
                <MdDeleteForever size="1.2em" />
                <span className="popover-text">Delete all notifications</span>
            </button>
        </>
    )

    const bookmarksShowMore = (
        <>
            <button onClick={deleteAllBookmarkOption} className="flex-display delete-bookmarks-button">
                <MdDeleteForever size="1.2em" />
                <span className="popover-text">Remove all bookmarks</span>
            </button>
        </>
    )

    return (
        <>
            {
                showMoreButtonCategory.includes(currentTopic) &&
                <>
                    <div ref={target} className="topic-more-button-div">
                        <button className="topic-more-button" onClick={() => setShow(!show)}><MdMoreVert/></button>
                    </div>
                    <Overlay rootClose target={target.current} show={show} onHide={() => setShow(false)} placement="bottom-end">
                        {({
                            ...props
                        }) => (
                            <Popover {...props} className="topic-more-popover">
                                <Popover.Body className="topic-more-popover-body">
                                    { currentTopic === CategoryConstant.CATEGORY_TITLE_NOTIFICATIONS && notificationsShowMore }
                                    { currentTopic === CategoryConstant.CATEGORY_TITLE_BOOKMARKS && bookmarksShowMore }
                                </Popover.Body>
                            </Popover>
                        )}
                    </Overlay>
                </>

            }            
        </>
        
    );
};