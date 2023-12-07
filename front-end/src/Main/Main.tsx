import { Allotment } from 'allotment';
import "allotment/dist/style.css";
import { Col, Container, Row } from 'react-bootstrap';
import AccountModal from '../Account/AccountModal';
import { Profile } from '../Account/Profile/Profile';
import Content from '../Content/Content';
import { CommentModal } from '../Content/modal/CommentModal';
import { PopupDisplay } from '../Content/modal/PopupDisplay';
import CreateComment from '../CreateComment/CreateComment';
import CreatePost from '../CreatePost/CreatePost';
import LoadingBar from '../LoadingBar';
import Menu from '../Menu/Menu';
import Topic from '../Topic/Topic';
import "./Main.css";

const Main = ({notFound = false}: {notFound?: boolean}): JSX.Element  => {

    return (
        <>  
            <LoadingBar/>
            <Container className="main-container ambilight">
                <Menu />
                <Row className="main-row">
                    <Allotment className="main-split">
                        <Allotment.Pane minSize={100} preferredSize="28%">
                            <Col className="topic-col">
                                <Topic />
                            </Col>
                        </Allotment.Pane>
                        <Allotment.Pane minSize={200} preferredSize="72%">
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