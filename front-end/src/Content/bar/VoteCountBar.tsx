import "./VoteCountBar.css";

type VoteCountBarProps = Readonly<{
    upvoteCount: number;
    downvoteCount: number;
    upvoted: boolean;
    downvoted: boolean;
}>;

export const VoteCountBar = ({upvoteCount, downvoteCount, upvoted, downvoted}: VoteCountBarProps): JSX.Element => {

    const upvoteCountPercentage = () => {
        if(upvoteCount === 0 && downvoteCount === 0) {
            return 0;
        }
        return upvoteCount / (upvoteCount + downvoteCount) * 100;
    }

    const downvoteCountPercentage = () => {
        if(upvoteCount === 0 && downvoteCount === 0) {
            return 100;
        }
        return downvoteCount / (upvoteCount + downvoteCount) * 100;
    };

    return (
        <div className="vote-count-bar">
            <div className={`upvote-count-bar ${!!upvoted ? "voted" : ""}`} style={{width: `${upvoteCountPercentage() + '%'}`}}/>
            <div className={`downvote-count-bar ${!!downvoted ? "voted" : ""}`} style={{width: `${downvoteCountPercentage() + '%'}`}}/>
        </div>
    );
};