import React, { useEffect, useState } from 'react';
import "../Content.css";

export const PageButton = ({pageRange, pageNumber, scrollTo}) => {
    const [range, setRange] = useState([]);
    useEffect(() => {
        setRange(pageRange);
    }, [pageRange]);

    return (
            !!pageNumber ?
                <div className="page-button-div">
                    <div className="page-button-inner-div">
                        <select className="page-button-select" value={pageNumber} onChange={(e) => {scrollTo(parseInt(e.target.value))}}>
                            {
                                !!range && range.map((item, index) => {
                                    return <option key={index} value={item}>
                                        {`Page ${item}`}
                                    </option>
                                })
                            }
                        </select>
                        {pageNumber}
                    </div>
                </div>
            : <></>
    );
};