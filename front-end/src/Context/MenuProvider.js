import React, { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

const MenuProvider = ({children}) => {
    const [menu, setMenu] = useState(false);
    const value = {menu, setMenu};
    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
};

function useMenu() {
    const context = useContext(MenuContext);
    if(context === undefined) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
}

export { MenuProvider, useMenu };
