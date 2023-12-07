import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useContent } from "../../Context/ContentProvider";
import "../Content.css";
import { BookmarkButton } from "../button/BookmarkButton";
import { CreateCommentButton } from "../button/CreateCommentButton";
import { ShareButton } from "../button/ShareButton";
import { SortButton } from "../button/SortButton";

export const ContentHeader = (): JSX.Element => {

    const content = useContent();
    const [contentTitle, setContentTitle] = useState<string>("");
    const [infoPage, setInfoPage] = useState<boolean>(false);
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
                        !!content.post && content.postId !== null && !infoPage &&
                            <>
                                <div className="flex-display">
                                    <div data-tooltip-id={`share-tooltip`} data-tooltip-content="Share" data-tooltip-place="bottom" title="Share">
                                        <ShareButton postId={content.postId} title={contentTitle} />
                                    </div>
                                    <div data-tooltip-id={`bookmark-tooltip`} data-tooltip-content="Bookmark" data-tooltip-place="bottom" title="Bookmark">
                                        <BookmarkButton />
                                    </div>
                                    <div data-tooltip-id={`sort-tooltip`} data-tooltip-content="Sort" data-tooltip-place="bottom" title="Sort">
                                        <SortButton />
                                    </div>
                                    <div data-tooltip-id={`reply-tooltip`} data-tooltip-content="Reply" data-tooltip-place="bottom" title="Reply">
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