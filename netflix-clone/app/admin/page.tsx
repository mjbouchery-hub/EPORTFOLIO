"use client";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/globalContext"
import React from 'react'


function Page() {
  const {openModal} = useGlobalContext();
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin panel!</p>

      <Button onClick={() => openModal("add-movie")}>Manage Movies</Button>
    </div>
  )
}

export default Page;