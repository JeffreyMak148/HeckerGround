import React from 'react';
import "../Content.css";

export const LoadPreviousPage = ({fetchData}) => {

    return (
        <div className="load-previous-page-div" onClick={fetchData}><div className="load-previous-page">Load previous page</div></div>
    );
};