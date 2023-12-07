import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { FaCommentDots } from 'react-icons/fa';
import { RxCross1 } from "react-icons/rx";
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import { useUser } from '../Context/UserProvider';
import fetchUtil, { CurrentUserData } from '../util/fetchUtil';
import formatDate from '../util/formatDate';
import sortUtil from '../util/sortUtil';
import "./Topic.css";

import { UserData } from '../Account/Profile/Profile';
import { CommentData } from '../Content/Content';
import { CreatePostButton } from './button/CreatePostButton';
import { TopicHeader } from './header/TopicHeader';

export type PostData = {
    id: string;
    user: UserData;
    createDateTime: string;
    title: string;
    catId: number;
    upvote: number;
    downvote: number;
    numOfReplies: number;
    bookmarked: boolean;
}

export type NotificationData = {
    id: number;
    user: CurrentUserData;
    post: PostData;
    comment: CommentData;
    voteCount: number;
    createDateTime: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
}

const Topic = () => {

    const location = useLocation();
    const topic = useTopic();
    const content = useContent();
    const user = useUser();
    const modal = useModal();
    const loadingBar = useLoading();
    const pageSize = 20;

    const [datas, setDatas] = useState<Array<PostData | NotificationData>>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        const catId = parseInt(location.pathname.split("/category/")[1]);
        const profileId = parseInt(location.pathname.split("/profile/")[1]);
        const postId = location.pathname.split("/posts/")[1];
        const notification = location.pathname === "/notifications";
        const bookmark = location.pathname === "/bookmarks";
        
        if(!!postId) {
            const postCatId = !!content.post && postId === content.post.id ? content.post.catId : null;
            if(!topic.bookmark && !topic.notification && !topic.profileId && !!postCatId && postCatId !== topic.selectedCatId) {
                setDatas([]);
                setHasMore(true);
                setPageNum(1);
                topic.setSelectedCatId(postCatId);
            }
        }

        if(!!catId && catId !== topic.selectedCatId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setProfileId(null);
            topic.setProfileUser(null);
            topic.setSelectedCatId(catId);
            topic.setNotification(false);
            topic.setBookmark(false);
        }

        if(!!profileId && profileId !== topic.profileId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setSelectedCatId(null);
            topic.setProfileId(profileId);
            topic.setNotification(false);
            topic.setBookmark(false);
        }

        if(notification && notification !== topic.notification) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setProfileId(null);
            topic.setSelectedCatId(null);
            topic.setNotification(true);
            topic.setBookmark(false);
        }

        if(bookmark && bookmark !== topic.bookmark) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            topic.setProfileId(null);
            topic.setSelectedCatId(null);
            topic.setNotification(false);
            topic.setBookmark(true);
        }

    }, [location, content.post]);

    function fetchTopicsByCatIdAndPagination(
        catIdOption: number,
        pageNumOption: number,
        pageSizeOption: number,
        refreshOption?: boolean,
    ) {
        if(!!topic.selectedCatId && !loadingBar.topicLoading) {
            if(refreshOption) {
                setDatas([]);
                setHasMore(true);
            }
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/posts/category/${catIdOption}?page=${pageNumOption-1}&size=${pageSizeOption}`, "GET", null)
            .then(({status, data, currentUser}) => {
                if(!!data) {
                    if(data.topics.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum + 1));
                    }
                    if(data.topics.length < pageSizeOption) {
                        setHasMore(false);
                    }
                }
                if(refreshOption) {
                    setDatas([...data.topics]);
                } else {
                    setDatas(currentTopics => ([...currentTopics, ...data.topics]));
                }
                user.setCurrentUser(currentUser);
            })
            .then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function fetchProfileByProfileIdAndPagination(
        profileIdOption: number, 
        pageNumOption: number, 
        pageSizeOption: number, 
        refreshOption?: boolean
    ) {
        if(!!topic.profileId && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            if(refreshOption) {
                setDatas([]);
                setHasMore(true);
            }
            fetchUtil(`/api/profile/${profileIdOption}?page=${pageNumOption-1}&size=${pageSizeOption}`, "GET", null)
            .then(({status, data, currentUser}) => {
                if(!!data.posts) {
                    if(data.posts.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum + 1));
                    }
                    if(data.posts.length < pageSizeOption) {
                        setHasMore(false)
                    }
                }
                topic.setProfileUser(data.user);
                if(refreshOption) {
                    setDatas([...data.posts]);
                } else {
                    setDatas(currentTopics => ([...currentTopics, ...data.posts]));
                }
                user.setCurrentUser(currentUser);
            })
            .then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function fetchNotificationByPagination(
        pageNumOption: number, 
        pageSizeOption: number, 
        refreshOption?: boolean
    ) {
        if(topic.notification && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            if(refreshOption) {
                setDatas([]);
                setHasMore(true);
            }
            fetchUtil(`/api/notifications?page=${pageNumOption-1}&size=${pageSizeOption}`, "GET", null)
            .then(({status, data, currentUser}) => {
                if(!!data) {
                    if(data.notifications.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum + 1));
                    }
                    if(data.notifications.length < pageSizeOption) {
                        setHasMore(false);
                    }
                }
                if(refreshOption) {
                    setDatas([...data.notifications]);
                } else {
                    setDatas(currentTopics => ([...currentTopics, ...data.notifications]));
                }
                user.setCurrentUser(currentUser);
            })
            .then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function fetchBookmarkByPagination(
        pageNumOption: number, 
        pageSizeOption: number, 
        refreshOption?: boolean
    ) {
        if(topic.bookmark && !loadingBar.topicLoading) {
            loadingBar.setTopicLoading(true);
            if(refreshOption) {
                setDatas([]);
                setHasMore(true);
            }
            fetchUtil(`/api/bookmarks?page=${pageNumOption-1}&size=${pageSizeOption}`, "GET", null)
            .then(({status, data, currentUser}) => {
                if(!!data) {
                    if(data.topics.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum + 1));
                    }
                    if(data.topics.length < pageSizeOption) {
                        setHasMore(false);
                    }
                    data.topics.sort(sortUtil("-createDateTime"));
                }
                if(refreshOption) {
                    setDatas([...data.topics]);
                } else {
                    setDatas(currentTopics => ([...currentTopics, ...data.topics]));
                }
                user.setCurrentUser(currentUser);
            })
            .then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false);
            });
        }
    }

    function setNotificationRead(notification: NotificationData) {
        if(!loadingBar.topicLoading && !!notification) {
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/notifications/read/${notification.id}`, "POST", null)
            .then(({status, data, currentUser}) => {
                setDatas(currentTopic => {
                    let temp = [...currentTopic];
                    Object.assign(temp.find(item => data.id === item.id) as NotificationData, data as NotificationData);
                    return temp;
                });
                user.setCurrentUser(currentUser);
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        }
    }

    function deleteNotification(notification: NotificationData) {
        if(!loadingBar.topicLoading && !!notification) {
            loadingBar.setTopicLoading(true);
            fetchUtil(`/api/notifications/delete/${notification.id}`, "POST", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                setDatas(notifications => {
                    return datas.filter(n => n !== notification);
                })
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setTopicLoading(false)
            });
        }
    }

    useEffect(() => {
        if(!!topic.selectedCatId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            fetchTopicsByCatIdAndPagination(topic.selectedCatId, 1, pageSize);
        }
    }, [topic.selectedCatId]);

    useEffect(() => {
        if(!!topic.profileId) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            fetchProfileByProfileIdAndPagination(topic.profileId, 1, pageSize);
        }
    }, [topic.profileId]);

    useEffect(() => {
        if(topic.notification) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            fetchNotificationByPagination(1, pageSize);
        }
    }, [topic.notification]);

    useEffect(() => {
        if(topic.bookmark) {
            setDatas([]);
            setHasMore(true);
            setPageNum(1);
            fetchBookmarkByPagination(1, pageSize);
        }
    }, [topic.bookmark]);

    useEffect(() => {
        if(topic.refresh) {
            setPageNum(1);
            if(!!topic.selectedCatId && !loadingBar.topicLoading) {
                fetchTopicsByCatIdAndPagination(topic.selectedCatId, 1, pageSize, true);
            }
    
            if(!!topic.profileId && !loadingBar.topicLoading) {
                fetchProfileByProfileIdAndPagination(topic.profileId, 1, pageSize, true);
            }

            if(topic.notification && !loadingBar.topicLoading) {
                fetchNotificationByPagination(1, pageSize, true);
            }

            if(topic.bookmark && !loadingBar.topicLoading) {
                fetchBookmarkByPagination(1, pageSize, true);
            }
            topic.setRefresh(false);
            scrollToTop();
        }

    }, [topic.refresh]);

    const observer = useRef<IntersectionObserver>();
    const lastDataRef = useCallback((node: Element | null) => {
        if(loadingBar.topicLoading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                if(!!topic.selectedCatId) fetchTopicsByCatIdAndPagination(topic.selectedCatId, pageNum, pageSize);
                if(!!topic.profileId) fetchProfileByProfileIdAndPagination(topic.profileId, pageNum, pageSize);
                if(topic.notification) fetchNotificationByPagination(pageNum, pageSize);
                if(topic.bookmark) fetchBookmarkByPagination(pageNum, pageSize);
            }
        });

        if(node) observer.current.observe(node);
    }, [loadingBar.topicLoading, hasMore, topic.selectedCatId, topic.profileId, topic.notification, topic.bookmark, pageNum]);

    const topicRef = useRef<HTMLDivElement | null>(null);
    const scrollToTop = () => {
        if(!!topicRef.current) {
            topicRef.current.scroll({
                top: 0,
                behavior: "smooth"
            });
        }
    };

    function setPost(postId: string) {
        content.setPostId(postId);
        //Clear comment modal
        modal.setCreateCommentModal({show: false, postId: null, replyComment: null});
    }

    const chooseNotification = (notification: NotificationData) => {
        if(!loadingBar.contentLoading) {
            setPost(notification.post.id);
            topic.setNotificationId(notification.id);
            setNotificationRead(notification);
        }
    }    

    return (
        <>
            <TopicHeader />
            <div className="content-overflow topic-height" ref={topicRef}>
                {
                    loadingBar.topicLoading && (!datas || (!!datas && datas.length === 0)) ?
                        <ul>
                            {
                                Array(pageSize).fill(0).map((data,index) => 
                                    <li key={index}>
                                        <div className="post-topic-div">
                                            <div className="post-topic-div-inner">
                                                <div className="post-topic-top-half">
                                                    <Placeholder xs={6} bsPrefix="topic-placeholder"/>
                                                </div>
                                                <div className="post-topic-bottom-half">
                                                    <Placeholder xs={10} bsPrefix="topic-placeholder"/>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    :   !!datas && datas.length === 0 && topic.notification ?
                            <div className="empty-text">
                                No notifications
                            </div>
                    :   !!datas && datas.length === 0 && topic.bookmark ? 
                            <div className="empty-text">
                                No bookmarks
                            </div>
                    :   <ul>
                            {
                                datas && datas.map((data: any, index) => {
                                    return <React.Fragment key={data.id}>
                                        {
                                            topic.notification && !!data.post ?
                                                <li>
                                                    <div ref={datas.length === index + 1 ? lastDataRef : null} className="post-topic-div" title={data.title}>
                                                        <div className="post-topic-div-inner">
                                                            <div className="post-topic-top-half">
                                                                <span className={`notification-color${data.read ? ' title-read' : ''}`}>{data.title}</span>
                                                                <span className="date-color">{formatDate(data.createDateTime)}</span>
                                                                <div className="margin-left-auto flex-display">
                                                                    <span onClick={() => deleteNotification(data)} data-tooltip-id="topic-tooltip" data-tooltip-content="Delete" data-tooltip-place="top" title="Delete" className="topic-delete-icon flex-display">
                                                                        <RxCross1 />
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className={`post-topic-bottom-half${data.read ? ' read' : ''}`}>
                                                                {data.type.includes("COMMENT") ? <div className="before-text"></div> : <></> }
                                                                <div className="quote-message display-line-2">{data.message}</div>
                                                                <Link to={`/posts/${data.post.id}?comment=${data.comment?.commentNumber}`} className={`post-topic-link${data.id === topic.notificationId && content.postId === data.post.id ? ' selected-post-color' : ''}`} onClick={() => chooseNotification(data)}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            :
                                                <li>
                                                    <div ref={datas.length === index + 1 ? lastDataRef : null} className="post-topic-div" title={data.title}>
                                                        <div className="post-topic-div-inner">                                                
                                                            <div className="post-topic-top-half">
                                                                <span className="username-color">{data.user.username}</span>
                                                                <span className="date-color">{formatDate(data.createDateTime)}</span>
                                                                <div className="post-vote margin-left-auto flex-display">
                                                                    <span className="metadata-icon flex-display">{data.upvote-data.downvote >= 0 ? <BiSolidUpvote size="0.9em"/> : <BiSolidDownvote size="0.9em"/>}</span>{data.upvote-data.downvote}
                                                                </div>
                                                                <div className="post-num-replies flex-display">
                                                                    <span className="metadata-icon flex-display"><FaCommentDots size="0.9em"/></span>{data.numOfReplies}
                                                                </div>
                                                            </div>
                                                            <div className="post-topic-bottom-half">
                                                                <div className="data-title">{data.title}</div>
                                                                <Link to={`/posts/${data.id}?page=1`} className={`post-topic-link${content.postId === data.id ? ' selected-post-color' : ''}`} onClick={() => {if(!loadingBar.contentLoading) setPost(data.id)}} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                        }
                                    </React.Fragment>
                                })
                            }
                            {
                                loadingBar.topicLoading && hasMore && Array(3).fill(0).map((data, index) => 
                                    <li key={index}>
                                        <div className="post-topic-div">
                                            <div className="post-topic-div-inner">
                                                <div className="post-topic-top-half">
                                                    <Placeholder xs={6} bsPrefix="topic-placeholder"/>
                                                </div>
                                                <div className="post-topic-bottom-half">
                                                    <Placeholder xs={10} bsPrefix="topic-placeholder"/>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                )
                            }
                            {!topic.bookmark && !topic.notification && !topic.profileId && !hasMore && <li><div className="post-topic-div"><div className="post-topic-div-inner flex-item-center"><CreatePostButton from="topic"/></div></div></li>}
                        </ul>
                }
            </div>
            <Tooltip id="topic-tooltip" className="topic-tooltip" />
        </>
    );
};

export default Topic;