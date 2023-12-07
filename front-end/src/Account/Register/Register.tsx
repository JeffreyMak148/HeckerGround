import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import "./Register.css";

type RegisterProps = Readonly<{
    modalType: string;
    setModalType: React.Dispatch<React.SetStateAction<string>>;
    show: boolean;
    handleClose: () => void;
    setTempRegUsername: React.Dispatch<React.SetStateAction<string>>;
    setTempRegEmail: React.Dispatch<React.SetStateAction<string>>;
    setTempRegPassword: React.Dispatch<React.SetStateAction<string>>;
}>;

export const Register = ({modalType, setModalType, show, handleClose, setTempRegUsername, setTempRegEmail, setTempRegPassword}: RegisterProps): JSX.Element => {
    const modal = useModal();
    const loadingBar = useLoading();
    const [registerUsername, setRegisterUsername] = useState<string>("");
    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState<string>("");
    const [validUsername, setValidUsername] = useState<boolean>(true);
    const [validEmail, setValidEmail] = useState<boolean>(true);
    const [validPassword, setValidPassword] = useState<boolean>(true);
    const [validConfirmPassword, setValidConfirmPassword] = useState<boolean>(true);

    function validateEmail (e: string) {
        setValidEmail(isEmail(e));
    }

    function validateUsername (e: string) {
        setValidUsername(!!e);
    }

    function validatePassword (e: string) {
        setValidPassword(!!e);
        validateConfirmPassword(registerConfirmPassword);
    }

    function validateConfirmPassword (e: string) {
        setValidConfirmPassword(!!e && e === registerPassword);
    }

    function sendRegisterRequest () {
        if(modalType !== "register") {
            setModalType("register");
            return;
        }

        let inputMissing = false;

        if(!registerUsername) {
            modal.showPopup("Register Failed", "Please enter register username.");
            inputMissing = true;
        }

        if(!registerEmail) {
            modal.showPopup("Register Failed", "Please enter register email.");
            inputMissing = true;
        } else if(!isEmail(registerEmail)) {
            modal.showPopup("Register Failed", "Register email is invalid.");
            inputMissing = true;
        }

        if(!registerPassword) {
            modal.showPopup("Register Failed", "Please enter register password.");
            inputMissing = true;
        } else if(!registerConfirmPassword) {
            modal.showPopup("Register Failed", "Please confirm password.");
            inputMissing = true;
        } else if(registerPassword !== registerConfirmPassword) {
            modal.showPopup("Register Failed", "Password didn't match.");
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            username: registerUsername,
            email: registerEmail,
            password: registerPassword
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
            setTempRegUsername(registerUsername);
            setTempRegEmail(registerEmail);
            setTempRegPassword(registerPassword);
            setModalType("verification");
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
                                        <p>Register</p>
                                    </div>
                                    <div className="header-logo">
                                        <img src={'/static/images/logo_fade.png'} alt="Logo"/>
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
                                    <input className={`register-username-input${!validUsername ? " invalid-input" : ""}`} placeholder="Username" type="text" id="registerUsername" 
                                        value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} onBlur={(e) => validateUsername(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`register-email-input${!validEmail ? " invalid-input" : ""}`} placeholder="Register email" type="email" id="registerEmail" 
                                        value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} onBlur={(e) => validateEmail(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`register-password-input${!validPassword ? " invalid-input" : ""}`} placeholder="Password" type="password" id="registerPassword" 
                                        value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} onBlur={(e) => validatePassword(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`register-username-input${!validConfirmPassword ? " invalid-input" : ""}`} placeholder="Confirm password" type="password" id="registerConfirmPassword" 
                                        value={registerConfirmPassword} onChange={(e) => setRegisterConfirmPassword(e.target.value)} onBlur={(e) => validateConfirmPassword(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer className="login-modal-footer">
                        <button className="login-button" id="submit" type="button" onClick={() => setModalType("login")}>
                            Login
                        </button>
                        <button className="register-button register-modal-button" type="button" onClick={() => sendRegisterRequest()}>
                            Register
                        </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};