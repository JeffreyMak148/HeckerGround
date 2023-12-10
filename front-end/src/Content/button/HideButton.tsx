import { MdOutlineCommentsDisabled } from "react-icons/md";

import "../Content.css";

type HideButtonProps = Readonly<{
    commentId: number;
    setHideComments: React.Dispatch<React.SetStateAction<number[]>>;
}>;

export const HideButton = ({commentId, setHideComments}: HideButtonProps): JSX.Element => {    

    return (
            <>
                <button className="content-hide-button" onClick={() => setHideComments(currentHideComments => [...currentHideComments, commentId])}>
                    <MdOutlineCommentsDisabled size="1.1em" />
                </button>
            </>
    );
};