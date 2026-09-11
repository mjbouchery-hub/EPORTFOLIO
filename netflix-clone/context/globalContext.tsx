"use client";
import { createContext, useContext, useState } from "react";


interface GlobalContextType {
    modalKey: string | null;
    isModalOpen: boolean;
    openModal: (key: string) => void;
    closeModal: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({ 
    children,
}: {
    children: React.ReactNode;
}) => {
    
    const [modalKey, setModalKey] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (key: string) => {
        setModalKey(key);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setModalKey(null);
        setIsModalOpen(false);
    };

    return (
     <GlobalContext.Provider 
       value={{
         openModal,
         closeModal,
         isModalOpen,
         modalKey,
      }}>
        
        {children}
    </GlobalContext.Provider>
    );
};

export const useGlobalContext = () =>{
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }
    return context;
};
