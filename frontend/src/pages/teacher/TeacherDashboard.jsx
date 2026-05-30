import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { CalendarDays, Clock, MapPin, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        const data = await teacherService.getMyReservations(user.id);
        setReservations(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchMyReservations();
  }, [user.id]);

  const upcomingReservations = reservations
    .filter(res => new Date(`${res.dateRes}T${res.heureDebut}`) >= new Date())
    .sort((a, b) => new Date(`${a.dateRes}T${a.heureDebut}`) - new Date(`${b.dateRes}T${b.heureDebut}`));

  const nextReservation = upcomingReservations.length > 0 ? upcomingReservations[0] : null;

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tableau de bord Enseignant</h1>
        <p className="text-gray-500 mt-2 font-medium">Bienvenue, {user?.nomComplet}. Voici l'aperçu de vos séances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/50 p-6 flex items-center space-x-5 transition-all hover:-translate-y-1 hover:shadow-xl duration-300">
          <div className="p-3 bg-uca-light-green bg-opacity-20 rounded-lg text-uca-green">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Réservations (À venir)</p>
            <p className="text-2xl font-bold text-gray-900">{upcomingReservations.length}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-uca-green to-uca-light-green rounded-3xl shadow-premium shadow-uca-green/20 p-8 text-white flex flex-col justify-center items-start relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
            <CalendarDays size={120} />
          </div>
          <h3 className="text-2xl font-bold mb-2 relative z-10">Besoin d'une salle ?</h3>
          <p className="text-green-50 text-sm mb-6 relative z-10 font-medium">Recherchez et réservez une salle pour votre séance de rattrapage.</p>
          <Link to="/teacher/book" className="bg-white text-uca-green px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-0.5 relative z-10">
            Réserver maintenant
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100/50 bg-white/40">
          <h2 className="text-xl font-bold text-gray-800">Votre prochaine séance</h2>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-gray-500 text-center py-6 font-medium">Chargement...</p>
          ) : nextReservation ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between border border-uca-light-green/30 rounded-2xl p-6 bg-gradient-to-r from-green-50/50 to-transparent shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center text-uca-green font-extrabold text-xl">
                  <MapPin className="mr-2" size={24} />
                  Salle {nextReservation.salle.nom}
                </div>
                <div className="flex items-center text-gray-700 font-medium">
                  <CalendarDays className="mr-2 text-uca-light-green" size={20} />
                  {nextReservation.dateRes}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="mr-2" size={18} />
                  {nextReservation.heureDebut} - {nextReservation.heureFin}
                </div>
                <div className="text-sm text-gray-500 italic">
                  Motif: {nextReservation.motif}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune séance à venir n'est planifiée.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
