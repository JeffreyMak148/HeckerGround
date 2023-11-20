import React from 'react';
import { useContent } from '../../Context/ContentProvider';
import "./RefreshContent.css";

export const RefreshContent = () => {

    const content = useContent();

    const RefreshContent = () => {
        content.setRefresh(true);
    }
    
    return (
        <div className="refresh-comment-div" onClick={RefreshContent}><div className="refresh-comment">Refresh Comment</div></div>
    );
};