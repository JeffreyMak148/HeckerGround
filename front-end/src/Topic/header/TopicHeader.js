import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useContent } from "../../Context/ContentProvider";
import { useMenu } from "../../Context/MenuProvider";
import { useModal } from "../../Context/ModalProvider";
import { useTopic } from "../../Context/TopicProvider";
import { CategoryConstant } from "../../constant";
import "../Topic.css";
import { CreatePostButton } from "../button/CreatePostButton";
import { RefreshTopic } from "../button/RefreshTopic";
import { TopicMoreButton } from "../button/TopicMoreButton";

export const TopicHeader = () => {

    const content = useContent();
    const topic = useTopic();
    const modal = useModal();
    const menu = useMenu();
    const [title, setTitle] = useState("Chatting");
    const location = useLocation();

    useEffect(() => {
        const catId = location.pathname.split("/category/")[1];
        const profileId = location.pathname.split("/profile")[1];
        const notification = location.pathname === "/notifications";
        const bookmark = location.pathname === "/bookmarks";
        if(!!catId && !!topic.category) {
            let currentCat = topic.category.find(c => c.catId === parseInt(catId));
            if(!!currentCat) {
                setTitle(currentCat.category);
            } else {
                const error = {
                    status: null,
                    data: {
                        status: null,
                        errorMessage: "Category not found"
                    }
                }
                modal.showErrorPopup(error.status, error.data?.errorMessage);
                setTitle(catId);
            }
        }
        if(!!profileId && !!topic.profileUser) {
            setTitle(topic.profileUser.username);
        }
        if(notification && topic.notification) {
            setTitle(CategoryConstant.CATEGORY_TITLE_NOTIFICATIONS);
        }
        if(bookmark && topic.bookmark) {
            setTitle(CategoryConstant.CATEGORY_TITLE_BOOKMARKS);
        }
    }, [location, topic.category, topic.profileUser, content.post, topic.notification, topic.bookmark]);

    useEffect(() => {
        const postCatId = !!content.post ? content.post.catId : null;
        if(!topic.bookmark && !topic.notification && !topic.profileId && !!postCatId) {
            if(!!topic.category) {
                let currentCat = topic.category.find(c => c.catId === parseInt(postCatId));
                if(currentCat.category !== title) {
                    setTitle(currentCat.category);
                }
            }
        }
    }, [content.post]);

    return (
        <nav className="topic-header">
            <div className="flex-display height-100">
                <div className="position-absolute">
                    <div>
                        <button className="menu-button" onClick={() => menu.setMenu(true)}>
                            <FaBars className="height-100"/>
                        </button>
                    </div>
                </div>
                <div className="flex-1">
                    {
                        title ? 
                            <div className="topic-header-title">
                                <div className="topic-header-title-inner">
                                    {title}
                                </div>
                            </div>
                        :
                            <></>
                    }
                </div>
                <div data-tooltip-id="topic-tooltip" data-tooltip-content="Refresh" data-tooltip-place="bottom" title="Refresh">
                    <RefreshTopic/>
                </div>
                <div data-tooltip-id="topic-tooltip" data-tooltip-content="Create" data-tooltip-place="bottom" title="Create">
                    <CreatePostButton />
                </div>
                <div data-tooltip-id="topic-tooltip" data-tooltip-content="More" data-tooltip-place="bottom" title="More">
                    <TopicMoreButton currentTopic={title} />
                </div>
            </div>
        </nav>
    );
};