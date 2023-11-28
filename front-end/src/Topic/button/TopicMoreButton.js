import React, { useRef, useState } from 'react';
import { MdDeleteForever, MdMoreVert } from "react-icons/md";

import { Overlay, Popover } from 'react-bootstrap';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useTopic } from '../../Context/TopicProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import "./TopicMoreButton.css";

export const TopicMoreButton = () => {
    const [show, setShow] = useState(false);

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
            fetchUtil(`/api/notifications/delete/all`, null, "POST")
            .then(({status, data, currentUser}) => {
                if(!!currentUser) {
                    user.setUserProfile(currentUser);
                }
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

    return (
        <>
            <div ref={target} className="topic-more-button-div">
                <button className="topic-more-button" onClick={() => setShow(!show)}><MdMoreVert/></button>
            </div>
            <Overlay target={target.current} show={show} placement="bottom-end">
                {({
                    ...props
                }) => (
                    <Popover {...props} className="topic-more-popover">
                        <Popover.Body className="topic-more-popover-body">
                            <button onClick={deleteAllNotificationOption} className="flex-display delete-notifications-button"><MdDeleteForever size="1.2em" /><span className="popover-text">Delete all notifications</span></button>
                        </Popover.Body>
                    </Popover>
                )}
            </Overlay>
        </>
        
    );
};