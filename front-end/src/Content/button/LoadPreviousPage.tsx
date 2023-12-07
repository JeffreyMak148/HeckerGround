import "../Content.css";

export const LoadPreviousPage = ({fetchData}: {fetchData: () => void}): JSX.Element => {

    return (
        <div className="load-previous-page-div" onClick={fetchData}><div className="load-previous-page">Load previous page</div></div>
    );
};