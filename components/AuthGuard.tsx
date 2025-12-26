"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Amplify } from "aws-amplify";
import cognitoConfig from "@/lib/aws-config";

const Authenticator = dynamic(
  () => import("@aws-amplify/ui-react").then((m) => m.Authenticator),
  { ssr: false }
);

import "@aws-amplify/ui-react/styles.css";

export default function AuthGuard({ children }: any) {
  useEffect(() => {
    const isHttp = typeof window !== 'undefined' && window.location.protocol === 'http:';
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'server';
    
    console.log('=== Amplify Configuration ===');
    console.log('Protocol:', window.location.protocol);
    console.log('Hostname:', hostname);
    console.log('Is HTTP:', isHttp);
    console.log('Cognito Config:', cognitoConfig);
    console.log('================================');
    
    try {
      Amplify.configure(cognitoConfig);
      console.log('✅ Amplify configured successfully');
    } catch (error) {
      console.error('❌ Amplify configuration failed:', error);
    }
  }, []);

  return (
    <Authenticator>
      {() => children}
    </Authenticator>
  );
}
