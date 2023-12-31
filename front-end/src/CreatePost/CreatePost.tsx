import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsPlusLg } from "react-icons/bs";
import { useLoading } from '../Context/LoadingProvider';
import { useModal } from '../Context/ModalProvider';
import { useTopic } from '../Context/TopicProvider';
import { useUser } from '../Context/UserProvider';
import { CategoryData } from '../Menu/Menu';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import ResizeableDiv from '../util/ResizeableDiv';
import fetchUtil, { CurrentUserData } from '../util/fetchUtil';
import "./CreatePost.css";

const CreatePost = (): JSX.Element => {

    const [topicInput, setTopicInput] = useState<string>("");
    const [categoryInput, setCategoryInput] = useState<number>(1);
    const [categoryDropdown, setCategoryDropdown] = useState<CategoryData[] | null>(null);
    const [curHeight, setCurHeight] = useState<number>(480);
    const user = useUser();
    const modal = useModal();
    const topic = useTopic();
    const [html, setHTML] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [imageSrcs, setImageSrcs] = useState<string[]>([]);
    const [empty, setEmpty] = useState<boolean>(true);
    const loadingBar = useLoading();

    const handleHideCreatePost = () => {
        modal.setCreatePostModal({show: false});
        setHTML("");
        setText("");
        setEmpty(true);
    }

    function createPost () {

        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        }

        if(topicInput == "") {
            return;
        }

        if(empty) {
            return;
        }

        if(!loadingBar.backgroundLoading) {
            loadingBar.setBackgroundLoading(true);
            const reqBody = {
                title: topicInput,
                catId: categoryInput,
                content: html,
                plainText: text,
                imageSrcs: imageSrcs
            }
            fetchUtil("/api/posts", "POST", reqBody)
            .then(({status, data, currentUser}) => {
                user.setCurrentUser(currentUser as CurrentUserData);
                if(status === 200) {
                    setHTML("");
                    setText("");
                    setImageSrcs([]);
                    setEmpty(true);
                    window.location.href = `/posts/${data.id}`;
                } else if(status === 401) {
                    user.setIsLoggedIn(false);
                    user.setShowLogin(true);
                }
            })
            .catch(error => {
                modal.showErrorPopup(error.status, error.data?.errorMessage);
            })
            .finally(() => {
                loadingBar.setBackgroundLoading(false);
            });
        }

    }

    useEffect(() => {
        setCategoryDropdown(topic.category);

    }, [topic.category]);

    useEffect(() => {
        setCategoryInput(!!topic.selectedCatId ? topic.selectedCatId : categoryInput);
    }, [topic.selectedCatId]);

    return (
        <div>
            {
            modal.createPostModal.show ? 
                <div className="create-new-post-container" style={{height: `${curHeight}px`}}>
                    <ResizeableDiv top={true} minHeight={200} maxHeight={window.innerHeight - 70} setCurHeight={setCurHeight}>
                        <div className="create-new-post-container-inner">
                            <div className="create-post-top">
                                <div className="flex-1">
                                    <span className="create-topic-category-text">{categoryDropdown && categoryDropdown.find(c => c.catId === categoryInput)?.category}</span> - Create New Post
                                </div>
                                <div className="flex-display">
                                    <button className="create-post-button" id="submit" type="button" onClick={() => createPost()}>                                
                                        <BsPlusLg size="1.5em"/>
                                    </button>
                                </div>
                                <div className="close-button-div" onClick={handleHideCreatePost}>
                                    <AiOutlineClose size="1.5em" />
                                </div>
                            </div>
                            <div className="flex-display">
                                <input className="create-topic-input" type="text" id="postTopic" placeholder="Topic" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} />
                                <select className="create-category-dropdown" name="postCategory" id="postCategory" value={categoryInput} onChange={(e) => setCategoryInput(parseInt(e.target.value))}>
                                    {categoryDropdown && categoryDropdown.map(categoryDropdown =>
                                        <option defaultValue={categoryDropdown.catId === categoryInput ? "selected" : ""} key={categoryDropdown.catId} value={categoryDropdown.catId}>{categoryDropdown.category}</option>
                                    )}
                                </select>
                            </div>
                            <RichTextEditor setHTML={setHTML} setText={setText} setEmpty={setEmpty} setImageSrcs={setImageSrcs}/>
                        </div>
                    </ResizeableDiv>
                </div>
            : <></>
            }
        </div>
    );
};

export default CreatePost;