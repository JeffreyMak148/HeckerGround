import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import fetchUtil from '../../util/fetchUtil';
import "./ResetPassword.css";

export const VerifyResetPassword = ({modalType, setModalType, show, handleClose, tempResetEmail, setTempResetCode}) => {
    const modal = useModal();
    const loadingBar = useLoading();
    const [resetCode, setResetCode] = useState("");
    const [validCode, setValidCode] = useState(true);

    function validateCode(e) {
        setValidCode(!!e);
    }

    function sendNewCodeRequest () {
        let inputMissing = false;

        if(!tempResetEmail) {
            modal.showPopup("Send code failed", "Email is empty.");
            inputMissing = true;
        } else if(!isEmail(tempResetEmail)) {
            modal.showPopup("Send code failed", "Invalid email.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            email: tempResetEmail
        }

        loadingBar.setBackgroundLoading(true);

        fetchUtil(`/api/auth/reset-password/send`, reqBody, "POST")
        .then(({status, data}) => {
        })
        .then(() => {
            modal.showPopup("Notification", "Code sent.");
        })
        .catch(error => {
            modal.showErrorPopup(error.status, error.data?.errorMessage);
        })
        .finally(() => {
            loadingBar.setBackgroundLoading(false);
        });
    }

    function verifyResetPasswordRequest () {
        if(modalType !== "verifyResetPassword") {
            setModalType("verifyResetPassword");
            return;
        }

        let inputMissing = false;

        if(!resetCode) {
            modal.showPopup("Verify Failed", "Please enter code.");
            inputMissing = true;
        } else if(!validCode) {
            modal.showPopup("Verify Failed", "Code is invalid.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }


        const reqBody = {
            email: tempResetEmail,
            code: resetCode
        }

        loadingBar.setBackgroundLoading(true);

        fetchUtil(`/api/auth/reset-password/verify`, reqBody, "POST")
        .then(({status, data}) => {
        })
        .then(() => {
            setTempResetCode(resetCode);
            setModalType("setResetPassword");
        })
        .catch(error => {
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
                                        <p>Reset Password</p>
                                    </div>
                                    <div className="header-logo">
                                        <img src={'/static/images/logo_fade.png'} />
                                        {/* <Logo /> */}
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
                                <p className="reset-password-text">
                                    A code has been sent to the email if an account is associated with the email.
                                </p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`reset-password-code-input${!validCode ? " invalid-input" : ""}`} placeholder="Code" type="text" id="resetCode" 
                                        value={resetCode} onChange={(e) => setResetCode(e.target.value)} onBlur={(e) => validateCode(e.target.value)}/>
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
                        <Row>
                            <Col>
                                <div>
                                    <button className="verify-code-button" onClick={() => verifyResetPasswordRequest()}>
                                        Verify Code
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
                        <button className="register-button" type="button" onClick={() => setModalType("register")}>
                            Register
                        </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};