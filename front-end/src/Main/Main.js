import { Allotment } from 'allotment';
import "allotment/dist/style.css";
import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import AccountModal from '../Account/AccountModal';
import { Profile } from '../Account/Profile/Profile';
import Content from '../Content/Content';
import { CommentModal } from '../Content/modal/CommentModal';
import { PopupDisplay } from '../Content/modal/PopupDisplay';
import { useModal } from '../Context/ModalProvider';
import { useUser } from '../Context/UserProvider';
import CreateComment from '../CreateComment/CreateComment';
import CreatePost from '../CreatePost/CreatePost';
import LoadingBar from '../LoadingBar';
import Menu from '../Menu/Menu';
import Topic from '../Topic/Topic';
import fetchUtil from '../util/fetchUtil';
import "./Main.css";

const Main = ({notFound}) => {

    const user = useUser();
    const modal = useModal();

    useEffect(() => {
        fetchUtil("/api/auth/loggedin", null, "GET")
        .then(({status, data, currentUser}) => {
            if(!!data) {
                user.setIsLoggedIn(data);
                user.setUserProfile(currentUser);
            }
        })
        .catch(error => {
            modal.showErrorPopup(error.status, error.data?.errorMessage);
        });
    }, []);

    return (
        <>  
            <LoadingBar/>
            <Container className="main-container ambilight">
                <Menu />
                <Row className="main-row">
                    <Allotment verticle={true} className="main-split">
                        <Allotment.Pane minSize="100" preferredSize="25%">
                            <Col className="topic-col">
                                <Topic />
                            </Col>
                        </Allotment.Pane>
                        <Allotment.Pane minSize="200" preferredSize="75%">
                            <Col className="content-col">
                                <Content notFound={notFound}/>
                            </Col>
                        </Allotment.Pane>
                    </Allotment>
                </Row>
                <AccountModal />
                <CreateComment />
                <CreatePost />
                <PopupDisplay />
                <CommentModal />
                <Profile />
            </Container>
        </>
    );
};

export default Main;