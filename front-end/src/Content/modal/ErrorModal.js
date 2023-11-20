import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useModal } from '../../Context/ModalProvider';
import "./ErrorModal.css";

export const ErrorModal = ({position, id}) => {
    const modal = useModal();

    const [isClosing, setIsClosing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(modal.errorModal.find(e => e.errorId === id).error);
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
                modal.setErrorModal(currentErrors => {
                        return currentErrors.filter(e => e.errorId !== id);
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
                !!error ?
                    <div style={{top: `${position}rem`}} key={id} className={isClosing ? "error-modal slideOut content-overflow" : "error-modal slideIn content-overflow"}>
                        <div className="error-modal-top flex-display">
                            <div className="error-modal-title">
                                {
                                    !!error.status ? 
                                        <>
                                            {error.hideStatusCode ? <>{error.status}</> : <>Status: {error.status}</>}
                                        </>
                                    :
                                        <>Error</>

                                }
                            </div>
                            <div className="error-modal-button">
                                <button className="error-modal-close-button" onClick={() => setIsClosing(true)}><AiOutlineClose/></button>
                            </div>
                        </div>
                        <div className="error-modal-bottom">
                            {
                                !!error.data ?
                                    <>
                                        {error.data.errorMessage}                                
                                    </>
                                :
                                    <>
                                        Problem occured
                                    </>
                            }
                        </div>
                    </div>
                :
                <></>
            }
        </>
    );
};