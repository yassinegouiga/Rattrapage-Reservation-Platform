import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { CalendarDays, Clock, MapPin, XCircle, AlertCircle } from 'lucide-react';

const MyReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyReservations = async () => {
    setLoading(true);
    try {
      const data = await teacherService.getMyReservations(user.id);
      // Sort by date (descending)
      const sorted = data.sort((a, b) => new Date(`${b.dateRes}T${b.heureDebut}`) - new Date(`${a.dateRes}T${a.heureDebut}`));
      setReservations(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchMyReservations();
  }, [user.id]);

  const isFuture = (dateRes, heureDebut) => {
    return new Date(`${dateRes}T${heureDebut}`) > new Date();
  };

  const handleCancel = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.")) {
      try {
        await teacherService.cancelReservation(id);
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        console.error(error);
        alert("Erreur lors de l'annulation de la réservation.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mes Réservations</h1>
        <p className="text-gray-500 mt-2 font-medium">Consultez l'historique de vos séances et annulez celles à venir si besoin.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Séance</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Salle</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10 font-medium text-gray-500">Chargement...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Vous n'avez effectué aucune réservation.</td></tr>
              ) : (
                reservations.map((res) => {
                  const future = isFuture(res.dateRes, res.heureDebut);
                  return (
                    <tr key={res.id} className="hover:bg-white/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={res.motif}>
                          {res.motif}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <CalendarDays size={14} className="mr-2 text-gray-400"/>
                          {res.dateRes}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock size={14} className="mr-2 text-gray-400"/>
                          {res.heureDebut} - {res.heureFin}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-uca-green">
                          <MapPin size={16} className="mr-1" />
                          Salle {res.salle.nom}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-4 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm border ${future ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                          {future ? 'À venir' : 'Passée'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {future ? (
                          <button 
                            onClick={() => handleCancel(res.id)}
                            className="text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-xl border border-red-200 hover:border-transparent transition-all flex items-center ml-auto font-medium shadow-sm hover:shadow-md"
                            title="Annuler la réservation"
                          >
                            <XCircle size={16} className="mr-1.5" />
                            Annuler
                          </button>
                        ) : (
                          <span className="text-gray-400 flex items-center justify-end w-full" title="Impossible d'annuler une réservation passée">
                            <AlertCircle size={18} className="mr-1.5" />
                            Archivée
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
