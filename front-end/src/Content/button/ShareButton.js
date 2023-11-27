import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import CopyToClipboard from 'react-copy-to-clipboard';
import { BiSolidCopy } from 'react-icons/bi';
import { BsShareFill } from 'react-icons/bs';
import "../Content.css";

export const ShareButton = ({postId, commentNum, title, commentModal}) => {
    const [value, setValue] = useState("");

    const setShareValue = () => {
        const content = `${!!title ? `【${title}】` : ""}\n`;
        const link = `${!!commentNum ? `https://heckerground.com/posts/${postId}?comment=${commentNum}` : `https://heckerground.com/posts/${postId}?page=1`}`;
        setValue(content+link);
    };

    const shareContent = (
        <Popover id="share-popover" className="share-popover">
            <Popover.Body className="share-popover-body">
                <textarea className="share-text-area" readOnly value={value} />
                <CopyToClipboard text={value}>
                    <div className="share-copy-div">
                        <BiSolidCopy size="1.5em" />
                        Copy
                    </div>
                </CopyToClipboard>
            </Popover.Body>
        </Popover>
    );

    return (
            !!postId ? 
                    <OverlayTrigger
                        trigger="click"
                        rootClose
                        placement="bottom"
                        overlay={shareContent}
                    >
                        <span>
                            {
                                !!commentNum ?
                                    <button className="content-share-button" onClick={setShareValue}><BsShareFill /></button>
                                :
                                    <button className="share-button" onClick={setShareValue}><BsShareFill /></button>
                            }
                        </span>
                    </OverlayTrigger>
                :
                    <></>
    );
};