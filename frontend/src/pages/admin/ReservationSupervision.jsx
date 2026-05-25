import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trash2, Calendar, Clock, MapPin, User } from 'lucide-react';

const ReservationSupervision = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const data = await adminService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Voulez-vous vraiment annuler cette réservation ?')) {
      try {
        await adminService.deleteReservation(id);
        setReservations(reservations.filter(r => r.id !== id));
      } catch (error) {
        alert('Erreur lors de l\'annulation');
      }
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Supervision des Réservations</h1>
        <p className="text-gray-500 mt-1">Consultez ou annulez les réservations de l'université</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Heure</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Salle</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enseignant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Motif</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Chargement...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Aucune réservation pour le moment.</td></tr>
              ) : reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {formatDate(res.dateRes)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {res.heureDebut} - {res.heureFin}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <MapPin size={12} className="mr-1" />
                      {res.salle?.nom || 'Salle introuvable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <User size={14} className="mr-1 text-gray-400" />
                      {res.enseignant?.nomComplet || 'Utilisateur supprimé'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs" title={res.motif}>
                      {res.motif}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(res.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md border border-red-200 transition-colors flex items-center ml-auto"
                    >
                      <Trash2 size={14} className="mr-1" /> Annuler
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReservationSupervision;
