import React, { useEffect, useRef, useState } from 'react';
import { IoNotificationsCircle, IoPersonCircle } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { LoginButton } from '../Account/Login/LoginButton';
import { useLoading } from '../Context/LoadingProvider';
import { useMenu } from '../Context/MenuProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import { useUser } from '../Context/UserProvider';
import { ReactComponent as BookmarkLogo } from '../assets/bookmarks.svg';
import fetchUtil from '../util/fetchUtil';
import useOutsideClick from '../util/useOutsideClick';
import "./Menu.css";

const Menu = () => {
    const user = useUser();
    const topic = useTopic();
    const loading = useLoading();
    const navigate = useNavigate();
    const modal = useModal();
    const menu = useMenu();
    const [menuData, setMenuData] = useState([]);
        

    const menuRef = useRef(null);
    const menuOutsideClick = useOutsideClick(menuRef);
    
    useEffect(() => {
        if(menu.menu && menuOutsideClick) {
            menu.setMenu(false);
        }
    }, [menuOutsideClick]);

    useEffect(() => {
        if(!topic.category) {
            fetchUtil("/api/posts/category", null, "GET")
            .then(({status, currentUser, data}) => {
                user.setCurrentUser(currentUser);
                setMenuData(data);
                topic.setCategory(data);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            });
        }

    }, [topic]);

    useEffect(() => {
        if(user.showLogin || user.showProfile) {
            menu.setMenu(false);
        }
    }, [user.showLogin, user.showProfile]);

    const handleOpen = () => {
        modal.setProfileModal({show: false, profileId: user.userProfile.id});
        user.setShowProfile(true);
    }

    const goToNotification = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
            return;
        }

        navigate("/notifications");
        menu.setMenu(false);
    }

    const goToBookmark = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
            return;
        }

        navigate("/bookmarks");
        menu.setMenu(false);
    }

    return (
        <>
            <div className="position-absolute">
                <b className={menu.menu ? "overlay active" : "overlay" }/>
                <nav ref={menu.menu ? menuRef : null} className={menu.menu ? "nav-menu active content-overflow" : "nav-menu content-overflow"}>
                    <div className={"left-menu"}>
                        <div className="menu-icon-div">
                            <div className="menu-icon">
                                {user.isLoggedIn ? <button className="user-icon" onClick={handleOpen}><IoPersonCircle size="2em"/></button> : <LoginButton />}
                            </div>
                        </div>
                        <div className="menu-icon-div">
                            <div className="menu-icon" onClick={goToNotification}>
                                <a className="notification-icon"><IoNotificationsCircle size="2em"/></a>
                                {
                                    !!user.userProfile?.unreadNotification && user.userProfile.unreadNotification> 0 
                                    ?
                                        <div className="notification-count">{user.userProfile.unreadNotification < 99 ? user.userProfile.unreadNotification : "99+"}</div> 
                                    :
                                        <></>
                                }
                            </div>
                        </div>
                        <div className="menu-icon-div">
                            <div className="menu-icon" onClick={goToBookmark}>
                                <a className="bookmark-icon"><BookmarkLogo style={{height: '2em', width: '2em'}}/></a>
                            </div>
                        </div>
                    </div>
                    <div className={"right-menu"}>
                        <ul className="nav-menu-items" onClick={() => menu.setMenu(false)}>
                            {menuData.map((item, index) => {
                                return (
                                <li key={index} className="menu-text">
                                    <Link to={`/category/${item.catId}`} onClick={() => menu.setMenu(false)}>
                                        <span className={topic.selectedCatId === item.catId ? 'selected-category-color' : ''}>{item.category}</span>
                                    </Link>
                                </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Menu;