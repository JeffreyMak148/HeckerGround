import React from 'react';
import { MdRefresh } from "react-icons/md";
import { useTopic } from '../../Context/TopicProvider';
import "./RefreshTopic.css";

export const RefreshTopic = () => {

    const topic = useTopic();

    const refreshTopic = () => {
        topic.setRefresh(true);
    }

    return (
        <div className="refresh-button-div">
            <button className="refresh-button" onClick={refreshTopic}><MdRefresh/></button>
        </div>
    );
};