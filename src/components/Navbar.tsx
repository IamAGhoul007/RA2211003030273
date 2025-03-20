
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart2, Users, Activity } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border transition-all duration-300">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-medium text-xl">SocialLens</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-1">
          <Link 
            to="/" 
            className={cn("nav-link", isActive("/") && "active")}
          >
            Overview
          </Link>
          <Link 
            to="/top-users" 
            className={cn("nav-link", isActive("/top-users") && "active")}
          >
            <Users className="h-4 w-4 mr-1 inline-block" />
            Top Users
          </Link>
          <Link 
            to="/trending" 
            className={cn("nav-link", isActive("/trending") && "active")}
          >
            <BarChart2 className="h-4 w-4 mr-1 inline-block" />
            Trending
          </Link>
          <Link 
            to="/feed" 
            className={cn("nav-link", isActive("/feed") && "active")}
          >
            Feed
          </Link>
        </nav>
        
        <div className="md:hidden">
          <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border grid grid-cols-3 py-2">
            <Link 
              to="/top-users" 
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                isActive("/top-users") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Users className="h-5 w-5" />
              <span className="text-xs mt-1">Top Users</span>
            </Link>
            <Link 
              to="/trending" 
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                isActive("/trending") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <BarChart2 className="h-5 w-5" />
              <span className="text-xs mt-1">Trending</span>
            </Link>
            <Link 
              to="/feed" 
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                isActive("/feed") ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Activity className="h-5 w-5" />
              <span className="text-xs mt-1">Feed</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
