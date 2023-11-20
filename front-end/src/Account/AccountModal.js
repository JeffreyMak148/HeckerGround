import React, { useEffect, useState } from 'react';
import { useUser } from '../Context/UserProvider';
import "./AccountModal.css";
import { Login } from './Login/Login';
import { Register } from './Register/Register';
import { Verify } from './Register/Verify';
import { SendResetPassword } from './ResetPassword/SendResetPassword';
import { SetResetPassword } from './ResetPassword/SetResetPassword';
import { VerifyResetPassword } from './ResetPassword/VerifyResetPassword';

const AccountModal = () => {
    const user = useUser();
    const [show, setShow] = useState(false);
    const [modalType, setModalType] = useState("login");
    const [tempRegUsername, setTempRegUsername] = useState("");
    const [tempRegEmail, setTempRegEmail] = useState("")
    const [tempRegPassword, setTempRegPassword] = useState("");
    const [tempResetEmail, setTempResetEmail] = useState("");
    const [tempResetCode, setTempResetCode] = useState("");

    const handleClose = () => {
        user.setShowLogin(false);
        setShow(false);
        setModalType("");
        setTempRegUsername("");
        setTempRegEmail("");
        setTempRegPassword("");
        setTempResetEmail("");
        setTempResetCode("");
    }
    
    const currentStep = () => {
        switch(modalType) {
            case "login":
                return <Login modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} />
            case "register":
                return <Register modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} setTempRegUsername={setTempRegUsername} setTempRegEmail={setTempRegEmail} setTempRegPassword={setTempRegPassword}/>
            case "verification":
                return <Verify modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} tempRegUsername={tempRegUsername} tempRegEmail={tempRegEmail} tempRegPassword={tempRegPassword}/>
            case "sendResetPassword":
                return <SendResetPassword modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} setTempResetEmail={setTempResetEmail}/>
            case "verifyResetPassword":
                return <VerifyResetPassword modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} tempResetEmail={tempResetEmail} setTempResetCode={setTempResetCode}/>
            case "setResetPassword":
                return <SetResetPassword modalType={modalType} setModalType={setModalType} show={show} handleClose={handleClose} tempResetEmail={tempResetEmail} tempResetCode={tempResetCode}/>
        }

    }

    useEffect(() => {
        setShow(user.showLogin);
        setModalType("login");
    }, [user.showLogin]);

    return (
        <>
            {currentStep()}
        </>
    );
};

export default AccountModal;