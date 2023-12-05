import React, { PropsWithChildren, createContext, useContext, useState } from 'react';

interface MenuContextProps {
    menu: boolean;
    setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuContext = createContext<MenuContextProps | undefined>(undefined);

const MenuProvider = ({children}: PropsWithChildren<{}>) => {
    const [menu, setMenu] = useState<boolean>(false);

    const value: MenuContextProps = { menu, setMenu };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
};

function useMenu(): MenuContextProps  {
    const context = useContext(MenuContext);
    if(context === undefined) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
}

export { MenuProvider, useMenu };

