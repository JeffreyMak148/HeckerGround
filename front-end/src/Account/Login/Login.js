import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import constructErrorModal from '../../util/constructErrorModal';
import "./Login.css";

export const Login = ({modalType, setModalType, show, handleClose}) => {
    const modal = useModal();
    const user = useUser();
    const loadingBar = useLoading();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    function validateEmail(e) {
        setValidEmail(isEmail(e));
    }

    function validatePassword(e) {
        setValidPassword(!!e);
    }
    function sendLoginRequest () {
        if(modalType !== "login") {
            setModalType("login");
            return;
        }

        let inputMissing = false;

        if(!loginEmail) {
            const error = constructErrorModal("Login Failed", "Please enter login email.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        } else if(!isEmail(loginEmail)) {
            const error = constructErrorModal("Login Failed", "Login email is invalid.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        }

        if(!loginPassword) {
            const error = constructErrorModal("Login Failed", "Please enter login password.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            email: loginEmail,
            password: loginPassword
        }

        loadingBar.setBackgroundLoading(true);

        // Http only cookie can not be assessed by javascript
        fetch("/api/auth/signin", {
            "headers": {
            "Content-Type": "application/json",
            },
            "method": "POST",
            body: JSON.stringify(reqBody),
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
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length, error}]));
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
                                <div>
                                    <input className={`login-email-input${!validEmail ? " invalid-input" : ""}`} placeholder="Login email" type="email" id="loginEmail" 
                                        value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} onBlur={(e) => validateEmail(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`login-password-input${!validPassword ? " invalid-input" : ""}`} placeholder="Password" type="password" id="loginPassword" 
                                        value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onBlur={(e) => validatePassword(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>                        
                                <div>
                                    <button onClick={() => setModalType("sendResetPassword")} className="forgot-password-button">Forgot password?</button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer className="login-modal-footer">
                        <button className="login-button" id="submit" type="button" onClick={() => sendLoginRequest()}>
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