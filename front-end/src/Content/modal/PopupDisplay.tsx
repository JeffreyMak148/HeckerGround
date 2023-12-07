import { useEffect, useState } from 'react';
import { Popup, useModal } from '../../Context/ModalProvider';
import "./PopupDisplay.css";
import { PopupModal } from './PopupModal';

export const PopupDisplay = (): JSX.Element => {
    const modal = useModal();
    const [popups, setPopups] = useState<Popup[]>([]);

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