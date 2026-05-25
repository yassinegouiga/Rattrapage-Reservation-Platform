import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, DoorOpen, CalendarDays, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Professeurs', path: '/admin/users', icon: Users },
    { name: 'Salles', path: '/admin/rooms', icon: DoorOpen },
    { name: 'Réservations', path: '/admin/reservations', icon: CalendarDays },
  ];

  return (
    <div className="flex flex-col w-64 bg-uca-green text-white min-h-screen shadow-xl">
      <div className="flex items-center justify-center h-20 border-b border-uca-light-green bg-uca-green px-4">
        <h1 className="text-xl font-bold tracking-wider text-center">Gestion<br/>Rattrapages</h1>
      </div>
      
      <div className="p-4 border-b border-uca-light-green bg-uca-green bg-opacity-50">
        <p className="text-sm text-uca-gray">Connecté en tant que</p>
        <p className="font-semibold text-white truncate">{user?.nomComplet}</p>
        <p className="text-xs text-green-200 mt-1 uppercase tracking-widest">{user?.roles?.[0]?.replace('ROLE_', '')}</p>
      </div>

      <nav className="flex-grow flex flex-col pt-4 px-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-white text-uca-green shadow-md'
                  : 'text-white hover:bg-uca-light-green'
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
  );
};

export default Sidebar;
