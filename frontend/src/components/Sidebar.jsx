import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, DoorOpen, CalendarDays, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, closeMobileMenu }) => {
  const { logout, user } = useAuth();

  const isAdmin = user?.roles?.some(r => r === 'ROLE_ADMIN' || r?.name === 'ROLE_ADMIN');

  const adminNavItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Professeurs', path: '/admin/users', icon: Users },
    { name: 'Salles', path: '/admin/rooms', icon: DoorOpen },
    { name: 'Réservations', path: '/admin/reservations', icon: CalendarDays },
  ];

  const teacherNavItems = [
    { name: 'Tableau de bord', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Réserver', path: '/teacher/book', icon: DoorOpen },
    { name: 'Mes Réservations', path: '/teacher/reservations', icon: CalendarDays },
  ];

  const navItems = isAdmin ? adminNavItems : teacherNavItems;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={closeMobileMenu}
        ></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-uca-green text-white min-h-screen shadow-premium transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex flex-col items-center justify-center h-28 border-b border-uca-light-green/50 bg-uca-green px-4 pt-4 shrink-0">
        <div className="bg-white rounded p-1 mb-2 shadow-sm">
          <img 
            src="/logo-uca.png" 
            alt="Logo UCA" 
            className="h-10 object-contain"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="%23248f43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>';
            }}
          />
        </div>
        <h1 className="text-sm font-bold tracking-widest text-center uppercase">Gestion Rattrapages</h1>
      </div>
      
      <div className="p-4 border-b border-uca-light-green bg-uca-green bg-opacity-50">
        <p className="text-sm text-uca-gray">Connecté en tant que</p>
        <p className="font-semibold text-white truncate">{user?.nomComplet}</p>
        <p className="text-xs text-green-200 mt-1 uppercase tracking-widest">
          {isAdmin ? 'Administrateur' : 'Enseignant'}
        </p>
      </div>

      <nav className="flex-grow flex flex-col pt-4 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/20'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-uca-light-green">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg hover:bg-red-600 transition-colors duration-150 group"
        >
          <LogOut className="mr-3 h-5 w-5 text-red-300 group-hover:text-white" />
          Déconnexion
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
