"use client";
import React from "react";
import { GlobalContextProvider } from "@/context/globalContext";
import { ProfileContextProvider } from "@/context/profileContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";

interface Props {
  children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
  return (
    <GlobalContextProvider>
      <ProfileContextProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </ProfileContextProvider>
    </GlobalContextProvider>
  );
}

export default ContextProvider;