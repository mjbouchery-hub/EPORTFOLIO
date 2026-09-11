"use client";
import React from 'react'
import { GlobalContextProvider } from '@/context/globalContext';

interface props {
    children: React.ReactNode
}
function ContextProvider({ children }: { children: React.ReactNode }) {
    return (
        <GlobalContextProvider>
            {children}
        </GlobalContextProvider>
    );
}

export default ContextProvider;