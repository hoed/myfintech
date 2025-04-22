
import React from 'react';
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const Footer: React.FC<FooterProps> = ({ 
  className,
  variant = 'light'
}) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "w-full p-4 border-t text-center text-sm",
      variant === 'light' ? "bg-white text-gray-500" : "bg-sidebar text-white",
      className
    )}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p>© {currentYear} Hoed - MyFinTech. All rights reserved.</p>
        <div className="flex items-center space-x-4 mt-2 md:mt-0">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
