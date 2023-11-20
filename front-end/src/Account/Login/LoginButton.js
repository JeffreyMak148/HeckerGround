import React from 'react';
import { IoPersonCircle } from 'react-icons/io5';
import { useUser } from '../../Context/UserProvider';
import "./Login.css";

export const LoginButton = () => {
    const user = useUser();

    const handleOpen = () => {
        user.setShowLogin(true);
    }

    return (
        <>
            <button className="user-icon" onClick={handleOpen}><IoPersonCircle size="1.8em"/></button>
        </>
    );
};