import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

const LoadingProvider = ({children}) => {
    const [topicLoading, setTopicLoading] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);
    const [backgroundLoading, setBackgroundLoading] = useState(false);
    const value = {topicLoading, setTopicLoading, contentLoading, setContentLoading, backgroundLoading, setBackgroundLoading};
    return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
};

function useLoading() {
    const context = useContext(LoadingContext);
    if(context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}

export { LoadingProvider, useLoading };
