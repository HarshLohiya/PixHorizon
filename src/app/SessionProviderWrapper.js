// app/SessionProviderWrapper.js
"use client"; // This indicates it's a client component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
