"use client";
import ModalMovies from "@/components/modals/ModalMovies";
import React from "react";
import { useGlobalContext } from "@/context/globalContext";


interface Props {
  children: React.ReactNode;
}

function ModalProvider({ children }: Props) {
    const { isModalOpen, modalKey } = useGlobalContext();
  return (
  <>
  {isModalOpen && modalKey === "add-movie" && <ModalMovies />}
        {children}
      </>
  );
}

export default ModalProvider;