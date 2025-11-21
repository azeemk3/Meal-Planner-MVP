"use client";

import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Footer = () => {
  return (
    <footer className={cn(
      "bg-dark-background text-muted-foreground py-12 mt-20 border-t border-dark-border",
      "text-center text-sm"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <Link to="#" className="hover:text-dark-primary transition-colors">About</Link>
          <Link to="#" className="hover:text-dark-primary transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-dark-primary transition-colors">Terms of Service</Link>
          <Link to="#" className="hover:text-dark-primary transition-colors">Contact</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} MealPlanner. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;