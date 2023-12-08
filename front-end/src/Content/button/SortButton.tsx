import { useEffect, useRef, useState } from 'react';

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

import { Overlay, Popover } from 'react-bootstrap';
import { BiSort } from "react-icons/bi";

import { useLocation, useSearchParams } from 'react-router-dom';
import { Sort, useContent } from '../../Context/ContentProvider';
import { flipSortOrder } from '../../util/sortUtil';
import "./SortButton.css";

export const SortButton = (): JSX.Element => {
    const [show, setShow] = useState<boolean>(false);
    
    const target = useRef(null);
    const location = useLocation();
    const content = useContent();
    const [searchParams, setSearchParams] = useSearchParams();

    const getSortOrder = (property: string) => {
        if(content.sort.sortBy === property) {
            // Currently selected property
            return flipSortOrder(content.sort.sortOrder);
        }

        if(property === "id") {
            // Default asc order for id property
            return "asc";
        }

        // Default desc order
        return "desc";
    }

    const setSort = (sortBy: string, sortOrder: string) => {
        
        const sort = {
            sortBy: sortBy,
            sortOrder: sortOrder
        }

        content.setSort(sort);
        setShow(false);
    }

    const currentSortOrder = (property: string) => {
        if(content.sort.sortBy === property) {
            return content.sort.sortOrder;
        }

        if(property === "id") {
            // Default asc order for id
            return "asc";
        }

        // Default desc order
        return "desc";
    }

    const sortParam = (): Sort => {
        const sortByParam = searchParams.get("sortBy");
        const sortOrderParam = searchParams.get("sortOrder");
        if(!!sortByParam && !!sortOrderParam) {
            return {
                "sortBy": sortByParam,
                "sortOrder": sortOrderParam
            };
        }

        return {
            "sortBy": "id",
            "sortOrder": "asc"
        }
    }

    const commentParam = (): number => {
        const param = searchParams.get("comment");
        return param !== null && parseInt(param) > 0 ? parseInt(param) : NaN;
    }

    useEffect(() => {
        const postId = location.pathname.split("/posts/")[1]?.split('?')[0];
        if(!!postId && !!content.sort) {
            const url = new URL(window.location.toString());
            url.searchParams.set('sortBy', content.sort.sortBy);
            url.searchParams.set('sortOrder', content.sort.sortOrder);
            window.history.replaceState(
                null,
                "",
                url
            )
        }
    }, [location, content.sort]);

    useEffect(() => {
        const postId = location.pathname.split("/posts/")[1]?.split('?')[0];
        const sortByParam = searchParams.get("sortBy");
        const sortOrderParam = searchParams.get("sortOrder");
        if(!!postId && !commentParam() && !!sortByParam && !!sortOrderParam && content.sort.sortBy !== sortByParam && content.sort.sortOrder !== sortOrderParam) {
            // Ignore sort param when comment param is not null
            // TODO: Find a way to scroll to commentParam even if sortParam is provided
            // Current issue: pageNum can not be set correctly if exist both commentParam and sortParam
            content.setSort(sortParam());
        }

    }, [location, searchParams]);

    return (
        <>
            <div ref={target}>
                <button className="show-sort-button" onClick={() => setShow(!show)}><BiSort /></button>
            </div>
            <Overlay rootClose target={target.current} show={show} onHide={() => setShow(false)} placement="bottom-end">
                {({
                    ...props
                }) => (
                    <Popover {...props} className="sort-button-popover">
                        <Popover.Body className="sort-button-popover-body">
                            <button onClick={() => setSort("id", getSortOrder("id"))} className={`sort-button ${content.sort.sortBy === "id" ? "active" : ""}`}>
                                Sort by date {currentSortOrder("id") === "asc" ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                            </button>
                            <button onClick={() => setSort("vote", getSortOrder("vote"))} className={`sort-button ${content.sort.sortBy === "vote" ? "active" : ""}`}>
                                Sort by vote {currentSortOrder("vote") === "asc" ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
                            </button>
                            <button onClick={() => setSort("numberOfReply", getSortOrder("numberOfReply"))} className={`sort-button ${content.sort.sortBy === "numberOfReply" ? "active" : ""}`}>
                                Sort by reply counts {currentSortOrder("numberOfReply") === "asc" ? <TiArrowSortedDown /> : <TiArrowSortedUp />}
                            </button>
                        </Popover.Body>
                    </Popover>
                )}
            </Overlay>
        </>        
    );
};