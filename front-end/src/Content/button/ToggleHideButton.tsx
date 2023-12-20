import { MdOutlineCommentsDisabled, MdOutlineOpenInFull } from "react-icons/md";

import "../Content.css";

type ToggleHideButtonProps = Readonly<{
    hideComment?: () => void;
    showComment?: () => void;
    style?: React.CSSProperties;
}>;

export const ToggleHideButton = ({hideComment, showComment, style}: ToggleHideButtonProps): JSX.Element => {    

    return (
            <>
                {
                    !!showComment ?
                        <button className="content-hide-button active" onClick={showComment} style={style}>
                            <MdOutlineOpenInFull size="1.1em" data-tooltip-id="hide-tooltip" data-tooltip-content="Show" data-tooltip-place="top" title="Show" />
                        </button>
                    : !!hideComment &&
                        <button className="content-hide-button" onClick={hideComment} style={style}>
                            <MdOutlineCommentsDisabled size="1.1em" data-tooltip-id="hide-tooltip" data-tooltip-content="Hide" data-tooltip-place="top" title="Hide" />
                        </button>
                }
            </>
    );
};