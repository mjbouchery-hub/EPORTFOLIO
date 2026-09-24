"use client";
import { createContext, useContext, useState } from "react";
import { Movie } from "@/types/types";

interface GlobalContextType {
  modalKey: string | null;
  isModalOpen: boolean;
  openModal: (key: string, movie?: Movie | null) => void;
  closeModal: () => void;
  activeMovie: Movie | null;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const openModal = (key: string, movie?: Movie | null) => {
  setModalKey(key);
  setActiveMovie(movie ?? null);
  setIsModalOpen(true);
};

const closeModal = () => {
  setModalKey(null);
  setActiveMovie(null);
  setIsModalOpen(false);
};

  return (
    <GlobalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen,
        modalKey,
        activeMovie,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }
  return context;
};
