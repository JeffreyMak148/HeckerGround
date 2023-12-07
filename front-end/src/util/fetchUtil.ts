export interface CurrentUserData {
    id: number;
    createDateTime: string;
    username: string;
    enabled: boolean;
    locked: boolean;
    authenticated: boolean;
    unreadNotification: number;
}

export interface FetchUtilResponse extends Response {
    status: number;
    currentUser?: CurrentUserData;
    data?: any;
}

async function fetchUtil (url: string, requestMethod: "POST" | "GET", requestBody?: null | any, isMultipart?: boolean): Promise<FetchUtilResponse> {
    const fetchData: RequestInit = {
        method: requestMethod,
    };

    if(isMultipart) {
        // Do not set headers
    } else {
        fetchData.headers = {
            "Content-Type": "application/json"
        }
    }
    
    if(requestBody) {
        if(isMultipart) {
            fetchData.body = requestBody;
        } else {
            fetchData.body = JSON.stringify(requestBody);
        }
    }

    return fetch(url, fetchData).then((response) => {
        if(response.status === 200) {
            const contentType = response.headers.get("content-type");
            if(contentType && contentType.indexOf("application/json") !== -1) {
                return Promise.resolve(response.json().then(data => ({
                    status: response.status,
                    currentUser: data.currentUser,
                    data: data.data
                })) as Promise<FetchUtilResponse>)
            }
        }
        if(response.status >= 400 && response.status <= 599) {
            return response.json().then(data => Promise.reject({
                status: response.status,
                currentUser: data.currentUser,
                data: data.data
            }))
        }
        return Promise.resolve(response);
    })
    .catch(error => {
        return Promise.reject(error);
    })
}

export default fetchUtil;