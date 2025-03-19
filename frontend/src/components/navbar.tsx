"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, ListChecks, BarChart3, Image, LogOut } from "lucide-react";
import ProblemList from "./problemList";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

interface NavbarProps {
  onLogout?: () => void;
}

const iconStyle = {
  lineHeight: '1',
  paddingTop: '4px',
};

export default function Navbar({ onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout logic if onLogout is not provided
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleProblemListClick = () => {
    if (!location.pathname.startsWith("/problems")) {
      navigate("/problems");
    }
  };

  return (
    <>
      <header className="fixed top-5 left-0 right-0 z-50 animate-fadeIn">
        <div className="container">
          <div className="flex h-16 items-center justify-between bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-md px-6 hover:shadow-lg transition-all duration-300 ease-in-out hover:border-blue-200 group">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center space-x-2 group/logo" aria-label="ChainCode Home">
                <span className="text-xl font-bold text-[#241e58] group-hover/logo:text-blue-600 transition-colors duration-300 relative">
                  ChainCode
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover/logo:w-full"></span>
                </span>
              </Link>
              <nav className="hidden md:flex gap-8 animate-slideInFromTop" aria-label="Main Navigation">
                <Button variant="link" className="text-[#241e58]/80 hover:text-blue-600 px-0 h-8 relative overflow-hidden group/button">
                  <Link to="/polls" className="nav-link flex items-center gap-1.5 transform transition-transform duration-200 hover:translate-y-[-2px]">
                    <BarChart3 className="h-4 w-4 transition-transform duration-200 group-hover/button:rotate-6 text-blue-500" style={iconStyle} />
                    Polls
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 scale-x-0 origin-left group-hover/button:scale-x-100"></span>
                  </Link>
                </Button>
                <Button variant="link" className="text-[#241e58]/80 hover:text-blue-600 px-0 h-8 relative overflow-hidden group/button">
                  <Link to="/nft" className="nav-link flex items-center gap-1.5 transform transition-transform duration-200 hover:translate-y-[-2px]">
                    <Image className="h-4 w-4 transition-transform duration-200 group-hover/button:rotate-6 text-purple-400" style={iconStyle} />
                    My NFTs
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 scale-x-0 origin-left group-hover/button:scale-x-100"></span>
                  </Link>
                </Button>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="link" 
                      className="text-[#241e58]/80 hover:text-blue-600 px-0 h-8 relative overflow-hidden group/button"
                      onClick={handleProblemListClick}
                    >
                      <span className="nav-link flex items-center gap-1.5 transform transition-transform duration-200 hover:translate-y-[-2px]">
                        <ListChecks className="h-4 w-4 transition-transform duration-200 group-hover/button:rotate-6 text-green-500" style={iconStyle} />
                        Problem List
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300 scale-x-0 origin-left group-hover/button:scale-x-100"></span>
                      </span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <ProblemList />
                  </SheetContent>
                </Sheet>
              </nav>
            </div>

            <div className="flex items-center gap-3 animate-slideInFromRight">
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="hidden md:flex rounded-full text-[#241e58] border border-gray-200 bg-transparent hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 px-6 transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-100/50 relative overflow-hidden group/logout"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <LogOut className="h-4 w-4 text-red-500" style={iconStyle} />
                  Logout
                </span>
                <span className="absolute inset-0 w-0 bg-blue-50 transition-all duration-300 group-hover/logout:w-full"></span>
              </Button>
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-[#241e58] hover:bg-blue-50 transition-all duration-200 hover:rotate-3">
                      <MenuIcon className="h-6 w-6" style={iconStyle} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[250px]">
                    <div className="flex flex-col space-y-4 mt-8">
                      <Button variant="ghost" onClick={() => navigate("/polls")} className="flex items-center justify-start gap-2 transition-all duration-200 hover:translate-x-1">
                        <BarChart3 className="h-4 w-4 text-blue-500" style={iconStyle} />
                        Polls
                      </Button>
                      <Button variant="ghost" onClick={() => navigate("/nft")} className="flex items-center justify-start gap-2 transition-all duration-200 hover:translate-x-1">
                        <Image className="h-4 w-4 text-purple-400" style={iconStyle} />
                        My NFTs
                      </Button>
                      <Button variant="ghost" onClick={handleLogout} className="flex items-center justify-start gap-2 transition-all duration-200 hover:translate-x-1">
                        <LogOut className="h-4 w-4 text-red-500" style={iconStyle} />
                        Logout
                      </Button>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="flex items-center justify-start gap-2 transition-all duration-200 hover:translate-x-1"
                            onClick={handleProblemListClick}
                          >
                            <ListChecks className="h-4 w-4 text-green-500" style={iconStyle} />
                            Problem List
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                          <ProblemList />
                        </SheetContent>
                      </Sheet>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* This div creates space for the fixed header */}
      <div className="h-28"></div>
      
      {/* You'll need to add these animation classes to your globals.css or tailwind.config.js */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideInFromRight {
          from { transform: translateX(10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        .animate-slideInFromTop {
          animation: slideInFromTop 0.5s 0.3s ease-out both;
        }
        
        .animate-slideInFromRight {
          animation: slideInFromRight 0.5s 0.4s ease-out both;
        }
      `}</style>
    </>
  );
}
