import { useEffect, useState } from "react";

export default function useFetchByPagination (url, requestBody, requestMethod, pageNum) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    
    const fetchData = {
        headers: {
        "Content-Type": "application/json",
        },
        method: requestMethod,
    };

    
    if(requestBody) {
        fetchData.body = JSON.stringify(requestBody);
    }

    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch(url, fetchData).then((response) => {
            if(response.status === 200) {
                const contentType = response.headers.get("content-type");
                if(contentType && contentType.indexOf("application/json") !== -1) {
                    setHasMore(response.json().length === 0);
                    setData((prevData) => {
                        return [...prevData, response.json()];
                    });
                    setLoading(false);
                    return response.json();
                } else {
                    setHasMore(response.text().length === 0);
                    setData((prevData) => {
                        return [...prevData, response.text()];
                    });
                    setLoading(false);
                    return response.text();
                }
            }
        })
        .catch(e => {
            setError(true);
        })
    }, []);

    return {loading, error, data, hasMore};
}