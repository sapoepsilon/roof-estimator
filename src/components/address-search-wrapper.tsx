"use client";

import { AddressSearch } from "./address-search";
import { useState, useEffect } from "react";

export function AddressSearchWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-10 rounded-md bg-white/20 animate-pulse" />;
  }

  return (
    <AddressSearch
      onSelect={(place) => {
        console.log("Selected place:", place);
      }}
    />
  );
}
