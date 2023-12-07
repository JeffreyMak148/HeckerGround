import { BsPlusLg } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useModal } from '../../Context/ModalProvider';
import { useUser } from '../../Context/UserProvider';
import "./CreatePostButton.css";


export const CreatePostButton = ({from}: {from?: string}): JSX.Element => {
    const user = useUser();
    const modal = useModal();

    const handleExpandCreatePost = () => {
        if(!user.isLoggedIn) {
            user.setShowLogin(true);
        } else {
            modal.setCreatePostModal({show: true});
        }
    }

    return (
        <div>
            {
            from === "topic" ? 
                <>
                    <div className="post-topic-center">
                        Create Post
                    </div>
                    <Link to="" className="post-topic-link" onClick={handleExpandCreatePost} />
                </>
            :
                <button className="add-button" onClick={handleExpandCreatePost}><BsPlusLg/></button>
            }
        </div>
    );
};