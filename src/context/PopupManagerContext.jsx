import React, { createContext, useContext, useState } from 'react';

const PopupManagerContext = createContext();

export const usePopupManager = () => useContext(PopupManagerContext);

export const PopupManagerProvider = ({ children }) => {
    const [activePanelId, setActivePanelId] = useState(null);

    const openPanel = (panelId) => {
        setActivePanelId(panelId);
    };

    const closeAllPanels = () => {
        setActivePanelId(null);
    };

    const value = {
        activePanelId,
        openPanel,
        closeAllPanels,
    };

    return (
        <PopupManagerContext.Provider value={value}>
            {children}
        </PopupManagerContext.Provider>
    );
};