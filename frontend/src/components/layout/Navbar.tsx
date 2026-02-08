import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Github, Package, Box, TrendingUp, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const MotionDiv = motion.div as any;

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/raw-materials", label: "Materials", icon: Box },
    { to: "/production-plan", label: "Planning", icon: TrendingUp },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                Product Manager
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-500 mt-0.5">
                System Control
              </span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${ isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/Frois2/ProductManager" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md group text-sm" title="Ver código fonte no GitHub" >
              <Github size={18} className="transition-transform group-hover:rotate-12" />
              <span className="font-medium hidden sm:inline">GitHub</span>
            </a>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <MotionDiv initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white border-b border-gray-200" >
            <div className="px-2 pt-2 pb-3 space-y-1"> {links.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium ${ isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`}>
                  <link.icon size={20} />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </nav>
  );
};