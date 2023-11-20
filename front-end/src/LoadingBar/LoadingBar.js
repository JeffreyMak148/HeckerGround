import React from 'react';
import { useLoading } from '../Context/LoadingProvider';
import "./LoadingBar.css";

const LoadingBar = () => {

    const loading = useLoading();

    return (
        <>
            {
                loading.backgroundLoading || loading.topicLoading || loading.contentLoading ?
                    <div>
                        <div className="loading-bar"/>
                    </div>
                :
                <></>
            }
        </>
    );
};

export default LoadingBar;