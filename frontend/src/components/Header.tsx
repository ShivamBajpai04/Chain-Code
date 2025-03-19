import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Header() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <header className="fixed top-5 left-0 right-0 z-50">
      <div className="container">
        <div className="flex h-16 items-center justify-between bg-white/80 backdrop-blur-md rounded-full border border-gray-200 shadow-md px-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2 group" aria-label="ChainCode Home">
              {/* Logo removed, only keeping text */}
              <span className="text-xl font-bold text-[#241e58] group-hover:text-blue-600 transition-colors">ChainCode</span>
            </Link>
            <nav className="hidden md:flex gap-8" aria-label="Main Navigation">
              <Button variant="link" className="text-[#241e58]/80 hover:text-blue-600 px-0 h-8 relative">
                <Link to="/#features" className="nav-link">
                  Features
                  {/* Simplified single underline effect */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </Button>
              <Button variant="link" className="text-[#241e58]/80 hover:text-blue-600 px-0 h-8 relative">
                <Link to="/login" className="nav-link">
                  Practice
                  {/* Simplified single underline effect */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="hidden md:flex rounded-full text-[#241e58] border border-gray-200 bg-transparent hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 px-6 transition-all hover:scale-105"
            >
              <Link to="/login">Login</Link>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6 text-white shadow-lg hover:shadow-blue-200/50 transition-all hover:scale-105">
              <Link to="/signup" className="text-white">Get Started</Link>
            </Button>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" className="text-[#241e58]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
