import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { UserData } from '../Account/Profile/Profile';
import { Sort, useContent } from '../Context/ContentProvider';
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useUser } from '../Context/UserProvider';
import { PostData } from '../Topic/Topic';
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
import { StarButton } from './button/StarButton';
import { ToggleHideButton } from './button/ToggleHideButton';
import { Vote } from './button/Vote';
import { Footer } from './footer/Footer';
import { ContentHeader } from './header/ContentHeader';
import { Privacy } from './tnc/Privacy';
import { Terms } from './tnc/Terms';

export type CommentData = {
    id: number;
    user: UserData;
    post: PostData;
    replyComment?: CommentData;
    parentCommentIds?: number[];
    createDateTime: string;
    content: string;
    plainTest: String;
    imageSrcs: string[];
    commentNumber: number;
    numberOfReply: number;
    upvote: number;
    downvote: number;
    upvoted: boolean;
    downvoted: boolean;
    commentDisplayNum?: number;
}

type ContentProps = {
    notFound: boolean;
}

const Content = ({notFound}: ContentProps): JSX.Element => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [terms, setTerms] = useState<boolean>(false);
    const [privacy, setPrivacy] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentData[] | null | undefined>([]);
    const [pageNum, setPageNum] = useState<number | null>(null);
    const [displayPageNum, setDisplayPageNum] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [totalPage, setTotalPage] = useState<number | null>(null);
    const [renderedPages, setRenderedPages] = useState<number[] | null>([]);
    const [followUserIds, setFollowUserIds] = useState<number[]>([]);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement[]>([]);
    const pageNumRef = useRef<HTMLDivElement[]>([]);
    const location = useLocation();
    const content = useContent();
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const pageSize = 20;

    useEffect(() => {
        if(!!displayPageNum) {
            const url = new URL(window.location.toString());
            url.searchParams.set('page', displayPageNum.toString());
            window.history.replaceState(
                null,
                "",
                url
            )
        }
    }, [displayPageNum]);

    const pageParam = (): number => {
        const pageValidation = searchParams.get("page");
        if(pageValidation == null || parseInt(pageValidation) <= 0) {
            return 1;
        }
        return !!parseInt(pageValidation) ? parseInt(pageValidation) : 1;
    }

    const commentParam = (): number => {
        const param = searchParams.get("comment");
        return param !== null && parseInt(param) > 0 ? parseInt(param) : NaN;
    }

    const scrollTo = (pageNum: number) => {
        if(!loadingBar.contentLoading && pageNumRef.current.length && !!pageNumRef.current[pageNum]) {
            pageNumRef.current[pageNum].scrollIntoView();
        } else {
            fetchCommentsByPostIdAndPagination(content.postId as string, pageNum, pageSize, content.sort, false, null, null, true);
        }
    }

    const scrollToComment = (commentNum: number) => {
        if(!loadingBar.contentLoading && scrollRef.current.length && !!scrollRef.current[commentNum]) {
            scrollRef.current[commentNum].scrollIntoView();
        } else {
            fetchCommentsByPostIdAndPagination(content.postId as string, getPageNumber(commentNum), pageSize, content.sort, false, null, commentNum, true);
        }
    }

    const pageRange = (start: number, end: number) => {
        // inclusive
        const length = end + 1 - start;
        return Array.from({length}, (_, i) => start + i);
    }

    const getPageNumber = (commentNumber: number): number => {
        return Math.ceil(commentNumber / pageSize);
    }
    
    function showProfileModal(profileId: number) {
        if(!!profileId) {
            modal.setProfileModal(profileModal => ({...profileModal, profileId: profileId}));
        }
    }

    const populateCommentDisplayNum = (comments: CommentData[], pageNum: number) => {
        return comments.map((comment, i) => ({...comment, commentDisplayNum: pageNum*pageSize + i + 1}));
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
            setFollowUserIds([]);
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
        setFollowUserIds([]);
        if(!!commentParam()) {
            setPageNum(getPageNumber(commentParam()));
            fetchCommentsByPostIdAndPagination(content.postId as string, getPageNumber(commentParam()), pageSize, content.sort, false, null, commentParam());
        } else {
            setPageNum(pageParam());
            fetchCommentsByPostIdAndPagination(content.postId as string, pageParam(), pageSize, content.sort);
        }
        
    }, [content.postId, content.sort]);

    function fetchCommentsByPostIdAndPagination(
        postIdOption: string,
        pageNumOption: number,
        pageSizeOption: number,
        sortByOption: Sort,
        previousPageOption?: boolean,
        scrollToPageNumOption?: number | null,
        scrollToCommentNumOption?: number | null,
        resetOption?: boolean,
    ): void {
        if(!!postIdOption && !loadingBar.contentLoading) {
            loadingBar.setContentLoading(true);
            if(resetOption) {
                setPageNum(pageNumOption);
                setRenderedPages([]);
                setHasMore(true);
                setComments([]);
            }
            fetchUtil(`/api/posts/${postIdOption}?page=${pageNumOption-1}&size=${pageSizeOption}&sortBy=${sortByOption.sortBy}&sortOrder=${sortByOption.sortOrder}`, "GET", null)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser);
                if(!data.comments && !data.post) {
                    setError(true);
                }
                if(!!data.comments && !previousPageOption) {
                    if(data.comments.length === pageSizeOption) {
                        setPageNum(currentPageNum => (currentPageNum as number + 1));
                    }
                    if(data.comments.length < pageSizeOption) {
                        setHasMore(false);
                    }
                }
                content.setPost(data.post);
                if(resetOption) {
                    setComments(currentComments => [...populateCommentDisplayNum(data.comments, pageNumOption-1)]);
                } else if(!previousPageOption) {
                    setComments(currentComments => ([...currentComments as CommentData[], ...populateCommentDisplayNum(data.comments, pageNumOption-1)]));
                } else {
                    setComments(currentComments => ([...populateCommentDisplayNum(data.comments, pageNumOption-1), ...currentComments as CommentData[]]));
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
            const previousPage = renderedPages.at(0) as number -1;
            const currentPage = renderedPages.at(0) as number;
            fetchCommentsByPostIdAndPagination(content.postId as string, previousPage, pageSize, content.sort, true, currentPage);
        }
    }

    const lastDataObserver = useRef<IntersectionObserver>();
    const lastDataRef = useCallback((node: Element | null) => {
        if(loadingBar.contentLoading) return;
        if(lastDataObserver.current) lastDataObserver.current.disconnect();
        lastDataObserver.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore && !!comments && comments.length >= pageSize) {
                fetchCommentsByPostIdAndPagination(content.postId as string, pageNum as number, pageSize, content.sort);
            }
        });

        if(node) lastDataObserver.current.observe(node);
    }, [loadingBar.contentLoading, hasMore]);

    useEffect(() => {
        if(content.refresh && !!renderedPages) {
            const pageStart = (renderedPages.length > 0 ? renderedPages.at(0) : 0) as number;
            const pageEnd = (renderedPages.length > 0 ? renderedPages.at(-1) : 0) as number;
            if(!loadingBar.contentLoading) {
                loadingBar.setContentLoading(true);
                fetchUtil(`/api/posts/${content.postId}/range?pageStart=${pageStart-1}&pageEnd=${pageEnd-1}&size=${pageSize}&sortBy=${content.sort.sortBy}&sortOrder=${content.sort.sortOrder}`, "GET", null)
                .then(({status, data, currentUser}) => {
                    user.setCurrentUser(currentUser);
                    setComments(currentComments => ([...populateCommentDisplayNum(data.comments, pageStart-1)]));
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
            const firstCommentDisplayNum = comments.at(0)?.commentDisplayNum as number;
            const lastCommentDisplayNum = comments.at(-1)?.commentDisplayNum as number;
            setRenderedPages(prevRenderedPages => {
                return pageRange(getPageNumber(firstCommentDisplayNum), getPageNumber(lastCommentDisplayNum));
            });
        }
    }, [loadingBar.contentLoading]);

    const scrollToTop = () => {
        if(!!contentRef && !!contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }

    const toggleFollowUser = (commentId: number) => {
        if(!followUserIds.includes(commentId)) {
            setFollowUserIds(currentFollowUserIds => [...currentFollowUserIds, commentId]);
        } else {
            setFollowUserIds(currentFollowUserIds => {
                return currentFollowUserIds.filter(c => c !== commentId);
            })
        }
        return;
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
                                    Array(1).fill(0).map((data, index) => 
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
                                    (!!comments && !!content.postId && !!renderedPages && renderedPages.length > 0 && !renderedPages.includes(1)) &&
                                        <div>
                                            <LoadPreviousPage fetchData={fetchPreviousPage} />
                                        </div>
                                }
                                <ul>
                                    {
                                    comments && comments.map((data, index) => {
                                            return <React.Fragment key={data.id}>
                                                {
                                                    !!data.commentDisplayNum && (data.commentDisplayNum === 1 || (data.commentDisplayNum-1) % pageSize === 0) &&
                                                        <div id={`page_${getPageNumber(data.commentDisplayNum)}`} ref={(node: HTMLDivElement) => pageNumRef.current[getPageNumber(data.commentDisplayNum as number)] = node}>
                                                            <PageNumber
                                                                pageRange={pageRange(1, totalPage as number)} 
                                                                pageNum={getPageNumber(data.commentDisplayNum)}
                                                                setDisplayPageNum={setDisplayPageNum}
                                                                scrollTo={scrollTo}/>
                                                        </div>
                                                }
                                                {
                                                    (followUserIds.length === 0 || followUserIds.includes(data.user.id)) &&
                                                        <div id={`comment_${data.commentNumber}`} ref={(node: HTMLDivElement) => {
                                                                scrollRef.current[data.commentNumber] = node;
                                                            }} className={`content-div ${!!commentParam() && commentParam() === data.commentNumber ? "highlighted" : ""}`}>
                                                                {
                                                                    content.isCommentHidden(data.id) ?
                                                                        <>
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
                                                                                    <div className="content-star-div" data-tooltip-id="star-tooltip" data-tooltip-content="Follow comment" data-tooltip-place="top" title="Follow comment">
                                                                                        <StarButton toggleFollowUser={()=> toggleFollowUser(data.id)} following={followUserIds.includes(data.user.id)} />
                                                                                    </div>
                                                                                    <div className="content-reply-div" data-tooltip-id="reply-tooltip" data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                                                                        <CreateCommentButton reply={data}/>
                                                                                    </div>
                                                                                    <div className="content-hide-div">
                                                                                        <ToggleHideButton style={{width: "100%", textAlign: "left"}} showComment={() => content.toggleHiddenComment(data.id)} />
                                                                                    </div>
                                                                                    <div className="content-share-div" data-tooltip-id="share-tooltip" data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                                                                        <ShareButton postId={data.post.id} commentNum={data.commentNumber} title={data.post.title} />
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        </>
                                                                    :
                                                                        <>
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
                                                                                    <div className="content-star-div" data-tooltip-id="star-tooltip" data-tooltip-content="Follow comment" data-tooltip-place="top" title="Follow comment">
                                                                                        <StarButton toggleFollowUser={()=> toggleFollowUser(data.user.id)} following={followUserIds.includes(data.user.id)}/>
                                                                                    </div>
                                                                                    <div className="content-reply-div" data-tooltip-id="reply-tooltip" data-tooltip-content="Reply" data-tooltip-place="top" title="Reply">
                                                                                        <CreateCommentButton reply={data}/>
                                                                                    </div>
                                                                                    <div className="content-hide-div">
                                                                                        <ToggleHideButton hideComment={() => content.toggleHiddenComment(data.id)} />
                                                                                    </div>
                                                                                    <div className="content-share-div" data-tooltip-id="share-tooltip" data-tooltip-content="Share" data-tooltip-place="top" title="Share">
                                                                                        <ShareButton postId={data.post.id} commentNum={data.commentNumber} title={data.post.title} />
                                                                                    </div>
                                                                                </div>
                                                                                <ReplyComment toggleHiddenComment={content.toggleHiddenComment} hiddenCommentIds={content.hiddenCommentIds} replyComment={data.replyComment} showCount={3}/>
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
                                                                        </>
                                                                }
                                                        </div>
                                                }
                                            </React.Fragment>
                                        })
                                    }
                                    {
                                        loadingBar.contentLoading && hasMore && Array(3).fill(0).map((data, index) => 
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
                                { (!!comments && !!content.postId && !!renderedPages && renderedPages.length > 0) &&
                                        <>
                                            <PageButton pageRange={pageRange(1, totalPage as number)} pageNumber={displayPageNum as number} scrollTo={scrollTo} />
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
            <Tooltip id="sort-tooltip" className="content-tooltip" clickable={true}/>
            <Tooltip id="hide-tooltip" className="content-tooltip" clickable={true}/>            
        </>
    );
};

export default Content;