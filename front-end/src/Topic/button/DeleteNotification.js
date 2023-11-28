import React from 'react';
import { TiDelete } from "react-icons/ti";
import { useTopic } from '../../Context/TopicProvider';
import "./RefreshTopic.css";

export const DeleteNotification = ({notificationId}) => {

    const topic = useTopic();
    const modal = useModal();
    const loadingBar = useLoading();

    const deleteNotification = () => {
        fetchUtil(`/api/notifications/delete/${notificationId}`, null, "POST")
            .then(({status, data, currentUser}) => {
                if(!!currentUser) {
                    user.setUserProfile(currentUser);
                }
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        topic.setRefresh(true);
    }

    return (
        <button className="delete-all-button" onClick={deleteNotification}><TiDelete /></button>
    );
};