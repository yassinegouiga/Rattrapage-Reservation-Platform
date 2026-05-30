import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, DoorOpen, CalendarDays, Activity } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border border-white/50 p-6 flex items-center transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
    <div className={`p-4 rounded-xl ${colorClass} text-white mr-5 shadow-lg`}>
      <Icon size={28} />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">{title}</p>
      <p className="text-4xl font-extrabold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, rooms: 0, reservations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, rooms, reservations] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllRooms(),
          adminService.getAllReservations()
        ]);
        
        setStats({
          users: users.length,
          rooms: rooms.length,
          reservations: reservations.length
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Vue d'ensemble</h1>
        <p className="text-gray-500 mt-2 font-medium">Gérez les ressources de l'Université Cadi Ayyad</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Activity className="animate-spin text-uca-green" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard 
            title="Professeurs" 
            value={stats.users} 
            icon={Users} 
            colorClass="bg-blue-500 shadow-blue-500/30" 
          />
          <StatCard 
            title="Salles" 
            value={stats.rooms} 
            icon={DoorOpen} 
            colorClass="bg-uca-brown shadow-uca-brown/30" 
          />
          <StatCard 
            title="Réservations" 
            value={stats.reservations} 
            icon={CalendarDays} 
            colorClass="bg-uca-green shadow-uca-green/30" 
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
