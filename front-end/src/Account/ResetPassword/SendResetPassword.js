import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import fetchUtil from '../../util/fetchUtil';
import "./ResetPassword.css";

export const SendResetPassword = ({modalType, setModalType, show, handleClose, setTempResetEmail}) => {
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const [resetEmail, setResetEmail] = useState("");
    const [validEmail, setValidEmail] = useState(true);

    function validateEmail(e) {
        setValidEmail(isEmail(e));
    }

    function sendResetPasswordRequest () {
        if(modalType !== "sendResetPassword") {
            setModalType("sendResetPassword");
            return;
        }

        let inputMissing = false;

        if(!resetEmail) {
            modal.showPopup("Reset Password Failed", "Please enter email.");
            inputMissing = true;
        } else if(!isEmail(resetEmail)) {
            modal.showPopup("Reset Password Failed", "Email is invalid.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            email: resetEmail,
        }

        loadingBar.setBackgroundLoading(true);

        fetchUtil(`/api/auth/reset-password/send`, reqBody, "POST")
        .then(({status, data, currentUser}) => {
            user.setCurrentUser(currentUser);
            setTempResetEmail(data);
        })
        .then(() => {
            setModalType("verifyResetPassword");
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
                                <div>
                                    <p className="reset-password-text">A code will be sent to the email if an account is associated with the email.</p>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`reset-password-email-input${!validEmail ? " invalid-input" : ""}`} placeholder="Email" type="email" id="resetEmail" 
                                        value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} onBlur={(e) => validateEmail(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <button className="reset-password-button" onClick={() => sendResetPasswordRequest()}>
                                        Reset Password
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