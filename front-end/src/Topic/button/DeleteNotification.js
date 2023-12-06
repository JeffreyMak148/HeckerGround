import { TiDelete } from "react-icons/ti";
import { useTopic } from '../../Context/TopicProvider';
import fetchUtil from "../../util/fetchUtil";
import "./RefreshTopic.css";

export const DeleteNotification = ({notificationId}) => {

    const topic = useTopic();
    const modal = useModal();
    const loadingBar = useLoading();

    const deleteNotification = () => {
        fetchUtil(`/api/notifications/delete/${notificationId}`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
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