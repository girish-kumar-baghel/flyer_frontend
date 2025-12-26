"use client";

import React, { useEffect } from "react";
import "@/lib/amplifyClient";

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log("Amplify initialized (region):", process.env.NEXT_PUBLIC_AWS_REGION);
  }, []);
  return <>{children}</>;
}
