import React, { ReactNode, useState } from 'react';

export interface AppContextProps {
    lastRefresh: Date;
    setLastRefresh: (lastRefresh: Date) => void;
}

export const AppContext = React.createContext<AppContextProps | undefined>(undefined);

export interface AppContextWrapperProps {
    children: ReactNode;
}

export function AppContextProvider(props: AppContextWrapperProps) {
    const { children } = props;
    const [lastRefresh, setLastRefresh] = useState(new Date());

    return (
        <AppContext.Provider value={{
            lastRefresh,
            setLastRefresh,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function throwAppContextUndefined(): never {
    throw new ReferenceError("AppContext is undefined. " +
        "Make sure you have wrapped your App in an AppContextProvider.");
}
