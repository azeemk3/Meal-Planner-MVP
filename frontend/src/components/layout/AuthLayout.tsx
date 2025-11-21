"use client";

import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-background p-4"> {/* Changed background to dark-background */}
      <div className="w-full max-w-md bg-dark-card rounded-lg shadow-lg p-6 sm:p-8 border border-dark-border"> {/* Changed background and added border */}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;