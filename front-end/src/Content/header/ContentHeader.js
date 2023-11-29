import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../../Context/ContentProvider";
import { useTopic } from "../../Context/TopicProvider";
import "../Content.css";
import { BookmarkButton } from "../button/BookmarkButton";
import { CreateCommentButton } from "../button/CreateCommentButton";
import { ShareButton } from "../button/ShareButton";

export const ContentHeader = () => {

    const content = useContent();
    const topic = useTopic();
    const [contentTitle, setContentTitle] = useState("");
    const [infoPage, setInfoPage] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const termsLocation = location.pathname === "/terms-and-conditions";
        const privacyLocation = location.pathname === "/privacy-policy";

        if(!!termsLocation || !!privacyLocation) {
            setContentTitle(termsLocation ? "Terms and Conditions" : "Privacy Policy");
            setInfoPage(true);
        } else {
            if(content.post) {
                setContentTitle(content.post.title);
            } else {
                setContentTitle("");
            }
            setInfoPage(false);
        }
    }, [location, content.post]);

    return (
        <div className="content-header">
            <div className="flex-display height-100">
                <div className="flex-1 height-100 content-header-title-wrapper">
                    <div className="content-header-title">
                        {contentTitle}
                    </div>
                </div>
                <div>
                    {
                        !!content.post && !infoPage &&
                            <>
                                <div className="flex-display">
                                    <div data-tooltip-id={`share-tooltip`} data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                        <ShareButton postId={content.postId} title={contentTitle} />
                                    </div>
                                    <BookmarkButton />
                                    <div data-tooltip-id={`reply-tooltip`} data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                        <CreateCommentButton />
                                    </div>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div>
    );
};