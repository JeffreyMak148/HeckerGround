import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { IoPersonCircle } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil, { FetchUtilResponse } from '../../util/fetchUtil';
import { formatDateString } from '../../util/formatDate';
import "./Profile.css";

export type UserData = {
    id: number;
    createDateTime: string;
    username: string;
}

export const Profile = (): JSX.Element => {
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const [profileUser, setProfileUser] = useState<UserData | null>(null);
    
    useEffect(() => {
        if(!!modal.profileModal.profileId) {
            fetchUtil(`/api/profile/user/${modal.profileModal.profileId}`, "GET", null)
            .then(({status, currentUser, data}: FetchUtilResponse) => {
                user.setCurrentUser(currentUser);
                setProfileUser(data.user);
                modal.setProfileModal(profileModal => ({...profileModal, show: true}));
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
        }

    }, [modal.profileModal.profileId]);

    const handleClose = () => {
        modal.setProfileModal({show: false, profileId: null, from: null});
        user.setShowProfile(false);
    }
    

    function sendLogoutRequest() {
        loadingBar.setBackgroundLoading(true);
        fetchUtil("/api/auth/signout", "POST", null)
        .then(({status, data, currentUser}) => {
            user.setCurrentUser(currentUser);
        })
        .then(() => {
            handleClose();
            window.location.href = "";
        })
        .catch(error => {
            modal.showErrorPopup(error.status, error.data?.errorMessage);
        })
        .finally(() => {
            loadingBar.setBackgroundLoading(false);
        });
    }

    return (
        <>
            <Modal style={{zIndex: '6000'}} centered dialogClassName = "profile-modal-dialog fadeIn" contentClassName="profile-modal-content" backdropClassName="profile-modal-backdrop" show={modal.profileModal.show} onHide={handleClose} animation={false}>
                <Modal.Header className="profile-modal-header">
                    <div className="flex-1 profile-text">
                        Profile
                    </div>
                    <div>
                        <button className="profile-close-button" onClick={handleClose}><AiOutlineClose/></button>
                    </div>
                </Modal.Header>
                <Modal.Body className="profile-modal-body">
                    <div className="content-overflow">
                        <ul>
                            {
                                !!profileUser &&
                                <>
                                    <li>
                                        <Link to={`/profile/${profileUser.id}`} className="profile-item margin-top-8" onClick={handleClose}>
                                            <div className="flex-display">
                                                <div className="item-icon"><IoPersonCircle size="2em"/></div>
                                                <div className="item-user-info">
                                                    <div className="profile-item-top-half">
                                                        {profileUser.username}
                                                    </div>
                                                    <div className="profile-item-bottom-half">
                                                        <span className="item-info-text">#{profileUser.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link className="profile-item margin-top-8 disable-link" to={""}>
                                            Account created: {formatDateString(profileUser.createDateTime)}
                                        </Link>
                                    </li>
                                    {
                                        user.isLoggedIn && profileUser.id === user.userProfile?.id &&
                                            <li>
                                                <Link className="profile-item center-text logout-text-color" to={""} onClick={() => sendLogoutRequest()}>
                                                    Logout
                                                </Link>
                                            </li>
                                    }
                                </>
                            }
                        </ul>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};