import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-uca-gray overflow-hidden font-sans relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-uca-green rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-uca-light-green rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-white/50 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <img 
            src="/logo-uca.png" 
            alt="Logo UCA" 
            className="h-8 w-8 object-contain"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.style.display = 'none';
            }}
          />
          <h1 className="font-bold text-uca-green tracking-wide">Gestion Rattrapages</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-700 hover:text-uca-green focus:outline-none p-2 rounded-md bg-gray-100/50"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <Sidebar isOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto z-10 pt-16 md:pt-0">
        <div className="min-h-full p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
