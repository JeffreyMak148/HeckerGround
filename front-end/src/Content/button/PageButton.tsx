import { useEffect, useState } from 'react';
import "../Content.css";

type PageButtonProps = Readonly<{
    pageRange: number[];
    pageNumber: number;
    scrollTo: (pageNum: number) => void;
}>;

export const PageButton = ({pageRange, pageNumber, scrollTo}: PageButtonProps): JSX.Element => {
    const [range, setRange] = useState<number[]>([]);
    useEffect(() => {
        setRange(pageRange);
    }, [pageRange]);

    return (
        <>
            {
                !!pageNumber &&
                    <div className="page-button-div">
                        <div className="page-button-inner-div">
                            <select className="page-button-select" value={pageNumber} onChange={(e) => {scrollTo(parseInt(e.target.value))}}>
                                {
                                    !!range && range.map((item, index) => {
                                        return <option key={index} value={item}>
                                            {`Page ${item}`}
                                        </option>
                                    })
                                }
                            </select>
                            {pageNumber}
                        </div>
                    </div>
            }
        </>
    );
};