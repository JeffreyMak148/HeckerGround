import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiSolidDownArrow } from 'react-icons/bi';
import "../Content.css";

export const PageNumber = ({pageRange, pageNum, setDisplayPageNum, scrollTo}) => {
    const [range, setRange] = useState([]);
    useEffect(() => {
        setRange(pageRange);
    }, [pageRange]);

    const observer = useRef();
    const observeRef = useCallback(node => {
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting || entries[0].boundingClientRect.top < 0) {
                setDisplayPageNum(prevPageNum => {
                    return pageNum;
                });
            } else {
                setDisplayPageNum(pageNum - 1);
            }
        });

        if(node) observer.current.observe(node);
    }, []);

    return (
        <div ref={observeRef} className="page-number-div">
            <div className="page-number-inner-div">
                <span className="page-number-text">{`Page ${pageNum}`} <BiSolidDownArrow size="0.5em" /></span>
                <select className="page-select" value={pageNum} onChange={(e) => {scrollTo(parseInt(e.target.value))}}>
                    {
                        !!range && range.map((item, index) => {
                            return <option key={index} value={item}>
                                {`Page ${item}`}
                            </option>
                        })
                    }
                </select>
            </div>
        </div>
    );
};