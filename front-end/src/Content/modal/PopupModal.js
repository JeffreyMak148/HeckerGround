import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useModal } from '../../Context/ModalProvider';
import "./PopupModal.css";

export const PopupModal = ({position, id}) => {
    const modal = useModal();

    const [isClosing, setIsClosing] = useState(false);
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        setPopup(modal.popupModal.find(e => e.popupId === id));
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), 5000);

        return () => {
            clearTimeout(timeoutId);
        }
    }, []);

    useEffect(() => {
        if(isClosing) {{
            const timeoutId = setTimeout(function() {
                modal.setPopupModal(currentPopups => {
                        return currentPopups.filter(e => e.popupId !== id);
                })
            }, 300);
    
            return () => {
                clearTimeout(timeoutId);
            }
        }}
    }, [isClosing]);

    return (
        <>
            {
                !!popup &&
                    <div style={{top: `${position}rem`}} key={id} className={isClosing ? "popup slideOut content-overflow" : "popup slideIn content-overflow"}>
                        <div className="popup-header flex-display">
                            <div className="popup-title">
                                {
                                    !!popup.popupHeader ? 
                                        <>
                                            {popup.popupType === 'error' ? <>Status: {popup.popupHeader}</> : <>{popup.popupHeader}</>}
                                        </>
                                    :
                                        <>Error</>

                                }
                            </div>
                            <div>
                                <button className="popup-close-button" onClick={() => setIsClosing(true)}><AiOutlineClose/></button>
                            </div>
                        </div>
                        <div className="popup-body">
                            {
                                !!popup.popupBody ?
                                    <>
                                        {popup.popupBody}                                
                                    </>
                                :
                                    <>
                                        Problem occured
                                    </>
                            }
                        </div>
                    </div>
            }
        </>
    );
};