import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  
  const links = [
    { id: "home", name: "Home", path: "/", show: isHome ? false : true },
    { id: "works", name: "The Works", path: "/works", show: isHome ? false : true },
    {
      id: "enlightened",
      name: "Get Enlightened",
      path: "/enlightened",
      show: isHome ? false : true,
    },
    { id: "people", name: "The People", path: "/people", show: isHome ? false : true },
    {
      id: "dashboard",
      name: isAuthenticated ? "Dashboard" : null,
      path: isAuthenticated ? "/dashboard" : null,
      show: isHome ? false : true && isAuthenticated,
    },
    {
      id: "auth",
      name: isAuthenticated ? "Logout" : "Login",
      path: isAuthenticated ? "/logout" : "/login", // Use a unique path even if it's just for handling
      show: true,
      onClick: isAuthenticated ? handleLogout : undefined,
    },
  ];
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-trading-background/80 backdrop-blur-lg border-white/10">
      <div className="container mx-auto px-2 lg:px-4">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center">
            <img
              src="/uploads/logo.png"
              alt="Logo"
              className="h-24 w-auto object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => 
              link.show && link.name ? (
                <Link
                  key={link.id}
                  to={link.path || "#"}
                  className={`nav-link font-funnel text-lg ${
                    location.pathname === link.path
                      ? "text-trading-primary active-nav-link"
                      : ""
                  }`}
                  onClick={link.onClick || (link.path ? () => navigate(link.path) : undefined)}
                >
                  {link.name}
                </Link>
              ) : null
            )}
          </div>
          <Button
            variant="ghost"
            className="md:hidden flex items-center justify-center h-10 w-10 text-gray-400 hover:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-trading-background border-t border-white/10">
            {links.map((link) => 
              link.show && link.name ? (
                <Link
                  key={link.id}
                  to={link.path || "#"}
                  className={`block px-3 py-2 text-white hover:text-trading-primary font-funnel ${
                    location.pathname === link.path ? "text-trading-primary" : ""
                  }`}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (link.onClick) {
                      e.preventDefault();
                      link.onClick();
                    }
                  }}
                >
                  {link.name}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
