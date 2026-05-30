import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { teacherService } from '../../services/teacherService';
import { Search, MapPin, Users, Monitor, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    date: '',
    heureDebut: '',
    heureFin: ''
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [motif, setMotif] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchParams.heureDebut >= searchParams.heureFin) {
      setError("L'heure de fin doit être postérieure à l'heure de début.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Append seconds if missing, as LocalTime backend might expect HH:mm:ss, but ISO time HH:mm is usually accepted.
      // We will send HH:mm:00 just in case.
      const start = searchParams.heureDebut.length === 5 ? `${searchParams.heureDebut}:00` : searchParams.heureDebut;
      const end = searchParams.heureFin.length === 5 ? `${searchParams.heureFin}:00` : searchParams.heureFin;
      
      const rooms = await teacherService.getAvailableRooms(searchParams.date, start, end);
      setAvailableRooms(rooms);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche des salles.");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!motif.trim()) return;
    
    setIsSubmitting(true);
    try {
      const start = searchParams.heureDebut.length === 5 ? `${searchParams.heureDebut}:00` : searchParams.heureDebut;
      const end = searchParams.heureFin.length === 5 ? `${searchParams.heureFin}:00` : searchParams.heureFin;

      const reservationData = {
        dateRes: searchParams.date,
        heureDebut: start,
        heureFin: end,
        motif: motif,
        enseignant: { id: user.id },
        salle: { id: selectedRoom.id }
      };

      await teacherService.createReservation(reservationData);
      setSelectedRoom(null);
      setMotif('');
      // Redirect to reservations page to see it
      navigate('/teacher/reservations');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réservation (peut-être un conflit). Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Réserver une salle</h1>
        <p className="text-gray-500 mt-2 font-medium">Recherchez les salles disponibles et réservez votre créneau.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/50 p-6 md:p-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date</label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split('T')[0]} // Empêche les dates passées
              value={searchParams.date}
              onChange={e => setSearchParams({...searchParams, date: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uca-green focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heure de début</label>
            <input 
              type="time" 
              required
              value={searchParams.heureDebut}
              onChange={e => setSearchParams({...searchParams, heureDebut: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uca-green focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heure de fin</label>
            <input 
              type="time" 
              required
              value={searchParams.heureFin}
              onChange={e => setSearchParams({...searchParams, heureFin: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uca-green focus:bg-white transition-all shadow-sm"
            />
          </div>
          <div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center px-6 py-3 bg-gradient-to-r from-uca-green to-uca-light-green text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {loading ? 'Recherche...' : <><Search size={20} className="mr-2" /> Rechercher</>}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>

      {/* Résultats */}
      {hasSearched && !loading && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Résultats de la recherche ({availableRooms.length} salle{availableRooms.length !== 1 && 's'} disponible{availableRooms.length !== 1 && 's'})
          </h2>
          
          {availableRooms.length === 0 ? (
            <div className="bg-orange-50/80 backdrop-blur-sm text-orange-800 p-6 rounded-2xl border border-orange-100 text-center shadow-sm">
              <p className="font-medium">Aucune salle n'est disponible pour ce créneau. Veuillez essayer d'autres horaires.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRooms.map(room => (
                <div key={room.id} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border border-white/50 p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                      <MapPin size={24} className="mr-2 text-uca-green" />
                      {room.nom}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full shadow-sm border border-green-200">
                      Libre
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users size={16} className="mr-2 text-gray-400" />
                      Capacité : <strong className="ml-1 text-gray-800">{room.capacite} places</strong>
                    </div>
                    {room.equipements && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <Monitor size={16} className="mr-2 text-gray-400" />
                        Équipements : <span className="ml-1 text-gray-800">{room.equipements}</span>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedRoom(room)}
                    className="w-full flex justify-center items-center px-4 py-2.5 border-2 border-uca-green text-uca-green font-bold rounded-xl hover:bg-uca-green hover:text-white transition-all focus:ring-4 focus:ring-uca-green/20"
                  >
                    Sélectionner
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50">
            <div className="flex justify-between items-center p-6 border-b border-gray-100/50">
              <h2 className="text-xl font-extrabold text-gray-900">Confirmer la réservation</h2>
              <button onClick={() => setSelectedRoom(null)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleBook}>
              <div className="p-6 space-y-5">
                <div className="bg-gray-50/80 p-5 rounded-2xl text-sm text-gray-700 space-y-3 border border-gray-100 shadow-inner">
                  <p className="flex justify-between">
                    <span className="text-gray-500 font-medium">Salle :</span> 
                    <strong className="text-gray-900">{selectedRoom.nom}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500 font-medium">Date :</span> 
                    <strong className="text-gray-900">{searchParams.date}</strong>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500 font-medium">Horaire :</span> 
                    <strong className="text-gray-900">{searchParams.heureDebut} - {searchParams.heureFin}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Motif du rattrapage *</label>
                  <textarea 
                    required
                    rows="3"
                    value={motif}
                    onChange={e => setMotif(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uca-green transition-all shadow-sm"
                    placeholder="Ex: Rattrapage Programmation Web (SMI S6)"
                  ></textarea>
                </div>
              </div>
              
              <div className="px-6 py-5 border-t border-gray-100/50 bg-gray-50/50 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedRoom(null)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-white transition-colors shadow-sm"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto flex justify-center items-center px-5 py-2.5 bg-gradient-to-r from-uca-green to-uca-light-green text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Traitement...' : <><CheckCircle size={18} className="mr-2"/> Confirmer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookRoom;
