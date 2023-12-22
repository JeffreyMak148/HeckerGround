import { MdStar, MdStarOutline } from "react-icons/md";


import "../Content.css";

type StarButtonProps = Readonly<{
    toggleFollowUser?: () => void;
    following: boolean;
    style?: React.CSSProperties;
}>;

export const StarButton = ({following, toggleFollowUser, style}: StarButtonProps): JSX.Element => {    

    return (
            <>
                {
                    following ?
                        <button className="content-star-button active" onClick={toggleFollowUser} style={style}>
                            <MdStar size="1.1em"/>
                        </button>
                    :
                        <button className="content-star-button" onClick={toggleFollowUser} style={style}>
                            <MdStarOutline size="1.1em" />
                        </button>
                }
            </>
    );
};