import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface LoadingContextProps {
    topicLoading: boolean;
    setTopicLoading: React.Dispatch<React.SetStateAction<boolean>>;
    contentLoading: boolean;
    setContentLoading: React.Dispatch<React.SetStateAction<boolean>>;
    backgroundLoading: boolean;
    setBackgroundLoading: React.Dispatch<React.SetStateAction<boolean>>;
}


const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

const LoadingProvider = ({ children }: PropsWithChildren<{}>) => {
    const [topicLoading, setTopicLoading] = useState<boolean>(false);
    const [contentLoading, setContentLoading] = useState<boolean>(false);
    const [backgroundLoading, setBackgroundLoading] = useState<boolean>(false);

    const value: LoadingContextProps = {
        topicLoading, setTopicLoading,
        contentLoading, setContentLoading,
        backgroundLoading, setBackgroundLoading,
    };
    
    return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
};

function useLoading(): LoadingContextProps {
    const context = useContext(LoadingContext);
    if(context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}

export { LoadingProvider, useLoading };

