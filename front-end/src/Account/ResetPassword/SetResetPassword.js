import React, { useState } from 'react';
import { Col, Container, Modal, Row } from 'react-bootstrap';
import isEmail from 'validator/lib/isEmail';
import { useLoading } from '../../Context/LoadingProvider';
import { useModal } from '../../Context/ModalProvider';
import constructErrorModal from '../../util/constructErrorModal';
import fetchUtil from '../../util/fetchUtil';
import "./ResetPassword.css";

export const SetResetPassword = ({modalType, setModalType, show, handleClose, tempResetEmail, tempResetCode}) => {
    const modal = useModal();
    const loadingBar = useLoading();
    const [resetPassword, setResetPassword] = useState("");
    const [confirmResetPassword, setConfirmResetPassword] = useState("");
    const [validPassword, setValidPassword] = useState(true);
    const [validConfirmPassword, setValidConfirmPassword] = useState(true);

    function validatePassword (e) {
        setValidPassword(!!e);
        validateConfirmPassword(confirmResetPassword);
    }

    function validateConfirmPassword (e) {
        setValidConfirmPassword(!!e && e === resetPassword);
    }

    function setResetPasswordRequest () {
        if(modalType !== "setResetPassword") {
            setModalType("setResetPassword");
            return;
        }

        let inputMissing = false;

        if(!tempResetEmail) {
            const error = constructErrorModal("Reset Password Failed", "Email is invalid.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        } else if(!isEmail(tempResetEmail)) {
            const error = constructErrorModal("Reset Password Failed", "Email is invalid.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        }

        if(!tempResetCode) {
            const error = constructErrorModal("Reset Password Failed", "Code is invalid.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        }

        if(!resetPassword) {
            const error = constructErrorModal("Reset Password Failed", "Please enter password.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        } else if(!confirmResetPassword) {
            const error = constructErrorModal("Reset Password Failed", "Please confirm password.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        } else if(resetPassword !== confirmResetPassword) {
            const error = constructErrorModal("Reset Password Failed", "Password didn't match.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
            inputMissing = true;
        }

        if(inputMissing) {
            return;
        }

        if(inputMissing) {
            return;
        }

        const reqBody = {
            email: tempResetEmail,
            code: tempResetCode,
            password: resetPassword
        }

        loadingBar.setBackgroundLoading(true);

        fetchUtil(`/api/auth/reset-password/set`, reqBody, "POST")
        .then(({status, data}) => {
        })
        .then(() => {
            setModalType("login");
            const error = constructErrorModal("Notification", "Password has been reset.", true);
            modal.setErrorModal(errorModal => [...errorModal, {errorId: errorModal.length, error}]);
        })
        .catch(error => {
            modal.setErrorModal(errorModal => ([...errorModal, {errorId: errorModal.length,  error}]));
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
                                        <img src={'/static/images/logo_fade.png'} alt="Logo" />
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
                                    <input className={`reset-password-password-input${!validPassword ? " invalid-input" : ""}`} placeholder="New Password" type="password" id="resetPassword" 
                                        value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} onBlur={(e) => validatePassword(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <input className={`reset-password-confirm-password-input${!validConfirmPassword ? " invalid-input" : ""}`} placeholder="Confirm new Password" type="password" id="confirmResetPassword" 
                                        value={confirmResetPassword} onChange={(e) => setConfirmResetPassword(e.target.value)} onBlur={(e) => validateConfirmPassword(e.target.value)}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div>
                                    <button className="reset-password-button" onClick={() => setResetPasswordRequest()}>
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