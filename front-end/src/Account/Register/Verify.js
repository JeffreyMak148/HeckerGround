import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import "./Verify.css";

export const Verify = ({modalType, setModalType, show, handleClose, tempRegUsername, tempRegEmail, tempRegPassword}) => {
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const [verificationCode, setVerificationCode] = useState("");
    const [validVerificationCode, setValidVerificationCode] = useState(true);
    function validateCode (e) {
        setValidVerificationCode(!!e);
    }

    function sendNewCodeRequest () {
        let inputMissing = false;

        if(!tempRegUsername) {
            modal.showPopup("Register Failed", "Please enter register username.");
            inputMissing = true;
        }

        if(!tempRegEmail) {
            modal.showPopup("Register Failed", "Please enter register email.");
            inputMissing = true;
        } else if(!isEmail(tempRegEmail)) {
            modal.showPopup("Register Failed", "Register email is invalid.");
            inputMissing = true;
        }

        if(!tempRegPassword) {
            modal.showPopup("Register Failed", "Please enter register password.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            username: tempRegUsername,
            email: tempRegEmail,
            password: tempRegPassword
        }

        loadingBar.setBackgroundLoading(true);

        // Http only cookie can not be assessed by javascript
        fetch("/api/auth/signup", {
            "headers": {
            "Content-Type": "application/json",
            },
            "method": "POST",
            body: JSON.stringify(reqBody),
        })
        .then((response) => {
            if(response.status === 200) {
                return Promise.all([response.json(), response.headers]);
            } else {
                return response.json().then(data => Promise.reject({
                    status: response.status,
                    data
                }))
            }
        })
        .then(([body, headers]) => {
            modal.showPopup("Notification", "Code sent.");
        })
        .catch((error) => {
            modal.showErrorPopup(error.status, error.data?.errorMessage);
        })
        .finally(() => {
            loadingBar.setBackgroundLoading(false);
        });
    }

    function sendVerificationRequest () {
        if(modalType !== "verification") {
            setModalType("verification");
            return;
        }

        let inputMissing = false;

        if(!verificationCode) {
            modal.showPopup("Verication Failed", "Please enter verification code.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }
        
        const reqBody = {
            username: tempRegUsername,
            code: verificationCode
        }

        loadingBar.setBackgroundLoading(true);
        fetch("/api/auth/verification", {
            "headers": {
            "Content-Type": "application/json",
            },
            "method": "POST",
            body: JSON.stringify(reqBody),
        })
        .then((response) => {
            if(response.status === 200) {
                return Promise.all([response.json(), response.headers]);
            } else {
                return response.json().then(data => Promise.reject({
                    status: response.status,
                    data
                }))
            }
        })
        .then(([body, headers]) => {
            const loginReqBody = {
                email: tempRegEmail,
                password: tempRegPassword
            }
            fetch("/api/auth/signin", {
                "headers": {
                "Content-Type": "application/json",
                },
                "method": "POST",
                body: JSON.stringify(loginReqBody),
            })
            .then((response) => {
                if(response.status === 200) {
                    user.setIsLoggedIn(true);
                    return Promise.all([response.json(), response.headers]);
                } else {
                    return response.json().then(data => Promise.reject({
                        status: response.status,
                        data
                    }))
                }
            })
            .then(([body, headers]) => {
                window.location.href = "";
            })
            .catch((error) => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false)
            });
        })
        .catch((error) => {
            modal.showErrorPopup(error.status, error.data?.errorMessage);
        })
        .finally(() => {
            loadingBar.setBackgroundLoading(false);
        });
    }

    return (
        <>
            <Modal centered dialogClassName = "login-modal-dialog fadeIn" contentClassName="login-modal-content" show={show} onHide={handleClose} animation={false}>
                <Modal.Header className="login-modal-header">
                    <Container>
                        <Row>
                            <Col>
                                <div className="header-flex">
                                    <div className="header-text">
                                        <p>Login</p>
                                    </div>
                                    <div className="header-logo">
                                        <img src={'/static/images/logo_fade.png'} />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Header>
                <Modal.Body className="login-modal-body">
                    <Container>
                        <Row>
                            <Col>
                                <p className="verify-text">
                                    A verification code has been sent to your email.
                                </p>
                                <p className="verify-text">
                                    Enter the verification code to complete account registration.
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`verification-input${!validVerificationCode ? " invalid-input" : ""}`} placeholder="Verification code" type="text" id="verificationCode" 
                                        value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} onBlur={(e) => validateCode(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <button className="send-new-code-button" onClick={() => sendNewCodeRequest()}>
                                        Send new code
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer className="login-modal-footer">
                        <button className="login-button" id="submit" type="button" onClick={() => setModalType("login")}>
                            Login
                        </button>
                        <button className="verify-button" type="button" onClick={() => sendVerificationRequest()}>
                            Verify
                        </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Verify;