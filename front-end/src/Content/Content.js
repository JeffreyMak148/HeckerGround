import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useUser } from '../Context/UserProvider';
import fetchUtil from '../util/fetchUtil';
import formatDate, { formatFullDate } from '../util/formatDate';
import renderHtml from '../util/renderHtml';
import "./Content.css";
import { ReplyComment } from './ReplyComment';
import { CommentCount } from './button/CommentCount';
import { CreateCommentButton } from './button/CreateCommentButton';
import { LoadPreviousPage } from './button/LoadPreviousPage';
import { PageButton } from './button/PageButton';
import { PageNumber } from './button/PageNumber';
import { RefreshContent } from './button/RefreshContent';
import { ShareButton } from './button/ShareButton';
import { Vote } from './button/Vote';
import { Footer } from './footer/Footer';
import { ContentHeader } from './header/ContentHeader';
import { Privacy } from './tnc/Privacy';
import { Terms } from './tnc/Terms';

const Content = ({notFound}) => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [terms, setTerms] = useState(false);
    const [privacy, setPrivacy] = useState(false);
    const [comments, setComments] = useState([]);
    const [pageNum, setPageNum] = useState(null);
    const [displayPageNum, setDisplayPageNum] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);
    const [totalPage, setTotalPage] = useState(null);
    const [renderedPages, setRenderedPages] = useState([]);
    const contentRef = useRef(null);
    const scrollRef = useRef([]);
    const pageNumRef = useRef([]);
    const location = useLocation();
    const content = useContent();
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const pageSize = 20;

    useEffect(() => {
        if(!!displayPageNum) {
            window.history.replaceState(
                null,
                "",
                `?page=${displayPageNum}`
            )
        }
    }, [displayPageNum]);

    const pageParam = () => {
        const pageValidation = searchParams.get("page");
        if(pageValidation == null || pageValidation <= 0) {
            return 1;
        }
        return !!parseInt(pageValidation) ? parseInt(pageValidation) : 1;
    }

    const commentParam = () => {
        return parseInt(searchParams.get("comment")) > 0 ? parseInt(searchParams.get("comment")) : NaN;
    }

    const scrollTo = (pageNum) => {
        if(!loadingBar.contentLoading && pageNumRef.current.length && !!pageNumRef.current[pageNum]) {
            pageNumRef.current[pageNum].scrollIntoView();
        } else {
            fetchCommentsByPostIdAndPagination(content.postId, pageNum, pageSize, false, false, false, true);
        }
    }

    const scrollToComment = (commentNum) => {
        if(!loadingBar.contentLoading && scrollRef.current.length && !!scrollRef.current[commentNum]) {
            scrollRef.current[commentNum].scrollIntoView();
        } else {
            fetchCommentsByPostIdAndPagination(content.postId, getPageNumber(commentNum), pageSize, false, false, commentNum, true);
        }
    }

    const pageRange = (start, end) => {
        // inclusive
        const length = end + 1 - start;
        return Array.from({length}, (_, i) => start + i);
    }

    const getPageNumber = (commentNumber) => {
        return Math.ceil(commentNumber / pageSize);
    }
    
    function showProfileModal(profileId) {
        if(!!profileId) {
            modal.setProfileModal(profileModal => ({...profileModal, profileId: profileId}));
        }
    }
    
    useEffect(() => {
        const postId = location.pathname.split("/posts/")[1]?.split('?')[0];
        const termsLocation = location.pathname === "/terms-and-conditions";
        const privacyLocation = location.pathname === "/privacy-policy";
        if(!!postId && postId !== content.postId) {
            content.setPostId(postId);
            setHasMore(true);
            if(!!commentParam()) {
                setPageNum(getPageNumber(commentParam()));
            } else {
                setPageNum(pageParam());
            }
            setComments([]);
            setRenderedPages([]);
        }

        if(!!termsLocation) {
            setTerms(true);
        } else {
            setTerms(false);
        }

        if(!!privacyLocation) {
            setPrivacy(true);
        } else {
            setPrivacy(false);
        }
    }, [location]);

    useEffect(() => {
        setError(false);
        setComments([]);
        setHasMore(true);        
        setRenderedPages([]);
        if(!!commentParam()) {
            setPageNum(getPageNumber(commentParam()));
            fetchCommentsByPostIdAndPagination(content.postId, getPageNumber(commentParam()), pageSize, false, false, commentParam());
        } else {
            setPageNum(pageParam());
            fetchCommentsByPostIdAndPagination(content.postId, pageParam(), pageSize);
        }
        
    }, [content.postId]);

    function fetchCommentsByPostIdAndPagination(postIdOption, pageNumOption, pageSizeOption, previousPageOption, scrollToPageNumOption, scrollToCommentNumOption, resetOption) {
        if(!!postIdOption && !loadingBar.contentLoading) {
            loadingBar.setContentLoading(true);
            if(resetOption) {
                setPageNum(pageNumOption);
                setRenderedPages([]);
                setHasMore(true);
                setComments([]);
            }
            fetchUtil(`/api/posts/${postIdOption}?page=${pageNumOption-1}&size=${pageSizeOption}`, null, "GET")
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                if(!data.comments && !data.post) {
                    setError(true);
                }
                if(!!data.comments && !previousPageOption) {
                    if(data.comments.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum + 1));
                    }
                    if(data.comments.length < pageSizeOption) {
                        setHasMore(false);
                    }
                }
                content.setPost(data.post);
                if(resetOption) {
                    setComments(currentComments => [...data.comments]);
                } else if(!previousPageOption) {
                    setComments(currentComments => ([...currentComments, ...data.comments]));
                } else {
                    setComments(currentComments => ([...data.comments, ...currentComments]));
                }
                setTotalPage(getPageNumber(data.post.numOfReplies));
            })
            .then(() => {
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                if(scrollToCommentNumOption || scrollToPageNumOption) {
                    setTimeout(() => {
                        if(scrollToCommentNumOption) {
                            if(!!scrollRef.current[scrollToCommentNumOption]) {
                                scrollRef.current[scrollToCommentNumOption].scrollIntoView();
                            }
                        } else if(scrollToPageNumOption) {
                            if(!!pageNumRef.current[scrollToPageNumOption]) {
                                pageNumRef.current[scrollToPageNumOption].scrollIntoView();
                            }
                        }
                        loadingBar.setContentLoading(false);
                    }, 100);
                } else {
                    loadingBar.setContentLoading(false);
                }
            })
        }
    }

    function fetchPreviousPage() {
        if(!!renderedPages && renderedPages.length > 0) {
            const previousPage = renderedPages.at(0)-1;
            const currentPage = renderedPages.at(0);
            fetchCommentsByPostIdAndPagination(content.postId, previousPage, pageSize, true, currentPage);
        }
    }

    const lastDataObserver = useRef();
    const lastDataRef = useCallback(node => {
        if(loadingBar.contentLoading) return;
        if(lastDataObserver.current) lastDataObserver.current.disconnect();
        lastDataObserver.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore && comments.length >= pageSize) {
                fetchCommentsByPostIdAndPagination(content.postId, pageNum, pageSize);
            }
        });

        if(node) lastDataObserver.current.observe(node);
    }, [loadingBar.contentLoading, hasMore]);

    useEffect(() => {
        if(content.refresh) {
            const pageStart = renderedPages.length > 0 ? renderedPages.at(0) : 0;
            const pageEnd = renderedPages.length > 0 ? renderedPages.at(-1) : 0;
            if(!loadingBar.contentLoading) {
                loadingBar.setContentLoading(true);
                fetchUtil(`/api/posts/${content.postId}/range?pageStart=${pageStart-1}&pageEnd=${pageEnd-1}&size=${pageSize}`, null, "GET")
                .then(({status, data, currentUser}) => {
                    user.setCurrentUser(currentUser);
                    setComments(currentComments => ([...data.comments]));
                    setHasMore((data.comments.length === (pageEnd - pageStart + 1) * pageSize));
                    setTotalPage(getPageNumber(data.post.numOfReplies));
                }).then(() => {
                    if(pageStart === 0 && pageEnd === 0) {
                        setPageNum(2);
                    }
                })
                .catch(error => {
                    modal.showErrorPopup(error.status, error.data?.errorMessage);
                })
                .finally(() => {
                    loadingBar.setContentLoading(false);
                })
            }
            content.setRefresh(false);
        }

    }, [content.refresh]);

    useEffect(() => {
        if(!loadingBar.contentLoading && !!comments && comments.length > 0) {
            setRenderedPages(prevRenderedPages => {
                return pageRange(getPageNumber(comments.at(0).commentNumber), getPageNumber(comments.at(-1).commentNumber));
            });
        }
    }, [loadingBar.contentLoading]);

    const scrollToTop = () => {
        if(!!contentRef) {
            contentRef.current.scrollTop = 0;
        }
    }

    return (
        <>
            <ContentHeader />
            <div className="content-overflow content-height" ref={contentRef}>
                {
                    terms || privacy ?
                         terms ? <Terms/> : <Privacy/>
                    :
                        loadingBar.contentLoading && (!comments || (!!comments && comments.length === 0))  ?
                            <ul>
                                <div className="page-number-div">
                                    <Placeholder xs={1} bsPrefix="content-placeholder"/>
                                </div>
                                {
                                    Array(1).fill().map((data, index) => 
                                        <li key={index}>
                                            <div className="content-div">
                                                <div className="content-info flex-display padding-top-10">
                                                    <Placeholder xs={3} bsPrefix="content-placeholder"/>
                                                </div>
                                                <div className="content-comment-div">
                                                    <Placeholder xs={7} bsPrefix="content-placeholder"/>
                                                    <Placeholder xs={10} bsPrefix="content-placeholder"/>
                                                    <Placeholder xs={8} bsPrefix="content-placeholder"/>
                                                    <Placeholder xs={6} bsPrefix="content-placeholder"/>
                                                </div>
                                                <div className="padding-bottom-15">
                                                    <Placeholder xs={2} bsPrefix="content-placeholder"/>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                }
                            </ul>
                        :
                            <>
                                {
                                    !!comments && !!content.postId && renderedPages.length > 0 && !renderedPages.includes(1) &&
                                        <div>
                                            <LoadPreviousPage fetchData={fetchPreviousPage} />
                                        </div>
                                }
                                <ul>
                                    {
                                    comments && comments.map((data, index) => {
                                            return <React.Fragment key={data.id}>
                                                {
                                                    data.commentNumber === 1 || (data.commentNumber-1) % pageSize === 0 &&
                                                        <div id={`page_${getPageNumber(data.commentNumber)}`} ref={node => pageNumRef.current[getPageNumber(data.commentNumber)] = node}>
                                                            <PageNumber
                                                                pageRange={pageRange(1, totalPage)} 
                                                                pageNum={getPageNumber(data.commentNumber)}
                                                                setDisplayPageNum={setDisplayPageNum}
                                                                scrollTo={scrollTo}/>
                                                        </div>
                                                }
                                                <div id={`comment_${data.commentNumber}`} ref={node => {
                                                        scrollRef.current[data.commentNumber] = node;
                                                    }} className={`content-div ${!!commentParam() && commentParam() === data.commentNumber ? "highlighted" : ""}`}>
                                                    <li>
                                                        <div className="content-info flex-display">
                                                            <div className="content-number-div">
                                                                #{data.commentNumber}
                                                            </div>
                                                            <div className="content-username-div" onClick={() => showProfileModal(data.user.id)}>
                                                                {data.user.username}
                                                            </div>
                                                            <div className="content-date-div" data-tooltip-id="date-tooltip" data-tooltip-content={formatFullDate(data.createDateTime)} data-tooltip-place="top" title={formatFullDate(data.createDateTime)}>
                                                                {formatDate(data.createDateTime)}
                                                            </div>
                                                            <div className="content-reply-div" data-tooltip-id="reply-tooltip" data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                                                <CreateCommentButton reply={data}/>
                                                            </div>
                                                            <div className="content-share-div" data-tooltip-id="share-tooltip" data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                                                <ShareButton postId={data.post.id} commentNum={data.commentNumber} title={data.post.title} />
                                                            </div>
                                                            <div></div>
                                                        </div>
                                                        <ReplyComment replyComment={data.replyComment} showCount={3}/>
                                                        <div className="content-comment-div">
                                                            {renderHtml(data.content)}
                                                        </div>
                                                        <div className="flex-display">
                                                            <div className="content-vote-div">
                                                                <Vote comment={data} />
                                                            </div>
                                                            {
                                                                data.numberOfReply > 0 &&
                                                                <div className="content-comment-count">
                                                                    <CommentCount count={data.numberOfReply} commentId={data.id}/>
                                                                </div>
                                                            }
                                                        </div>
                                                    </li>
                                                </div>
                                            </React.Fragment>
                                        })
                                    }
                                    {
                                        loadingBar.contentLoading && hasMore && Array(3).fill().map((data, index) => 
                                            <li key={index}>
                                                <div className="content-div">
                                                    <div className="content-info flex-display padding-top-10">
                                                        <Placeholder xs={3} bsPrefix="content-placeholder"/>
                                                    </div>
                                                    <div className="content-comment-div">
                                                        <Placeholder xs={7} bsPrefix="content-placeholder"/>
                                                        <Placeholder xs={10} bsPrefix="content-placeholder"/>
                                                        <Placeholder xs={8} bsPrefix="content-placeholder"/>
                                                        <Placeholder xs={6} bsPrefix="content-placeholder"/>
                                                    </div>
                                                    <div className="padding-bottom-15">
                                                        <Placeholder xs={2} bsPrefix="content-placeholder"/>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    }
                                </ul>
                                { !!comments && !!content.postId && renderedPages.length > 0 &&
                                        <>
                                            <PageButton pageRange={pageRange(1, totalPage)} pageNumber={displayPageNum} scrollTo={scrollTo} />
                                            <div ref={node => lastDataRef(node)}>
                                                <RefreshContent />
                                            </div>
                                        </>
                                }
                                {
                                    error &&
                                        <div className="post-not-available-div">
                                            Post is not available
                                        </div>
                                }
                                {
                                    notFound &&
                                        <div className="not-found-div">
                                            Page Not Found
                                        </div>
                                }
                            </>
                }
                <Footer scrollToTop={scrollToTop} />
            </div>
            <Tooltip id="date-tooltip" className="content-tooltip" clickable={true}/>
            <Tooltip id="reply-tooltip" className="content-tooltip" clickable={true}/>
            <Tooltip id="bookmark-tooltip" className="content-tooltip" clickable={true}/>
            <Tooltip id="share-tooltip" className="content-tooltip" clickable={true}/>
        </>
    );
};

export default Content;