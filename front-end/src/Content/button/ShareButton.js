import React, { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiSolidCopy } from 'react-icons/bi';
import { BsShareFill } from 'react-icons/bs';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import "../Content.css";

export const ShareButton = ({postId, commentNum, title, commentModal}) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [value, setValue] = useState("");

    const setShareValue = () => {
        const content = `${!!title ? `【${title}】` : ""}\n`;
        const link = `${!!commentNum ? `https://heckerground.com/posts/${postId}?comment=${commentNum}` : `https://heckerground.com/posts/${postId}?page=1`}`;
        setValue(content+link);
    }

    return (
            !!postId ? 
                <Popover
                    containerClassName="share-popover"
                    containerStyle={commentModal ? {zIndex: "1060"} : {zIndex: "6"}}
                    padding={10}
                    isOpen={isPopoverOpen}
                    positions={['bottom', 'top', 'left']}
                    onClickOutside={() => setIsPopoverOpen(false)}
                    content={({ position, childRect, popoverRect }) => (
                        <ArrowContainer
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowSize={10}
                            arrowColor={'#43434f'}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow">
                            <textarea className="share-text-area" readOnly value={value} />
                            <CopyToClipboard text={value}>
                                <div className="share-copy-div">
                                    <BiSolidCopy size="1.5em" />
                                    Copy
                                </div>
                            </CopyToClipboard>
                        </ArrowContainer>
                    )}>
                    {
                        !!commentNum ?
                            <button className="content-share-button" onClick={() => {setIsPopoverOpen(!isPopoverOpen); setShareValue()}}><BsShareFill /></button>
                        :
                            <button className="share-button" onClick={() => {setIsPopoverOpen(!isPopoverOpen); setShareValue()}}><BsShareFill /></button>
                    }
                </Popover>
            : <></>
    );
};