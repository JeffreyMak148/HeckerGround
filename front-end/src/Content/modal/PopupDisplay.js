import React, { useEffect, useState } from 'react';
import { useModal } from '../../Context/ModalProvider';
import "./PopupDisplay.css";
import { PopupModal } from './PopupModal';

export const PopupDisplay = () => {
    const modal = useModal();
    const [popups, setPopups] = useState([]);

    useEffect(() => {
        setPopups(modal.popupModal);
    }, [modal.popupModal]);

    return (
        <>
            <div className="popup-position">
                {popups.map((item, index) => {
                    return <PopupModal key={item.popupId} position={4+item.popupId*6} id={item.popupId} />
                })}
            </div>
        </>
    );
};