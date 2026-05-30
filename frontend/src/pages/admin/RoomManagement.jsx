import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trash2, Plus, Monitor, Power, PowerOff, X } from 'lucide-react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ nom: '', capacite: 30, equipements: '', estDisponible: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      const [roomsData, resData] = await Promise.all([
        adminService.getAllRooms(),
        adminService.getAllReservations()
      ]);
      setRooms(roomsData);
      setReservations(resData);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Voulez-vous vraiment supprimer cette salle ?')) {
      try {
        await adminService.deleteRoom(id);
        setRooms(rooms.filter(r => r.id !== id));
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const toggleAvailability = async (room) => {
    try {
      const updatedRoom = { ...room, estDisponible: !room.estDisponible };
      await adminService.updateRoom(room.id, updatedRoom);
      setRooms(rooms.map(r => r.id === room.id ? updatedRoom : r));
    } catch (error) {
      alert("Erreur lors de la mise à jour de la salle");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await adminService.createRoom(newRoom);
      setRooms([...rooms, created]);
      setShowModal(false);
      setNewRoom({ nom: '', capacite: 30, equipements: '', estDisponible: true });
    } catch (error) {
      alert("Erreur lors de la création de la salle.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Salles</h1>
          <p className="text-gray-500 mt-2 font-medium">Gérer les salles et leur disponibilité</p>
        </div>
        
        <div className="flex w-full md:w-auto items-center space-x-3">
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Rechercher une salle..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-uca-green shadow-sm transition-all"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center px-5 py-3 bg-gradient-to-r from-uca-green to-uca-light-green text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap font-semibold"
          >
            <Plus size={18} className="mr-2" />
            Nouvelle Salle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Chargement...</p>
        ) : rooms
          .filter(room => 
            room.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (room.equipements && room.equipements.toLowerCase().includes(searchQuery.toLowerCase()))
          )
          .map((room) => (
          <div key={room.id} className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border ${room.estDisponible ? 'border-white/50' : 'border-red-200/50 bg-red-50/50'} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">{room.nom}</h3>
                  <p className="text-sm text-gray-500 mt-1 font-medium">Capacité: {room.capacite} places</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${room.estDisponible ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                  {room.estDisponible ? 'DISPONIBLE' : 'HORS SERVICE'}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Monitor size={16} className="mr-2 text-gray-400" />
                  {room.equipements}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Séances à venir :</h4>
                  {reservations
                    .filter(res => res.salle.id === room.id && new Date(`${res.dateRes}T${res.heureDebut}`) >= new Date())
                    .sort((a, b) => new Date(`${a.dateRes}T${a.heureDebut}`) - new Date(`${b.dateRes}T${b.heureDebut}`))
                    .map((res, idx) => (
                      <div key={res.id} className="text-xs bg-gray-50 p-2 rounded mb-1 text-gray-600">
                        <strong>{res.dateRes}</strong> de {res.heureDebut} à {res.heureFin}
                      </div>
                    ))
                    .slice(0, 3)} {/* Show only next 3 to avoid making the card too huge */}
                  {reservations.filter(res => res.salle.id === room.id && new Date(`${res.dateRes}T${res.heureDebut}`) >= new Date()).length === 0 && (
                    <p className="text-xs text-gray-400 italic">Aucune séance prévue</p>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <button 
                    onClick={() => toggleAvailability(room)}
                    className={`flex items-center text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${room.estDisponible ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}
                  >
                    {room.estDisponible ? <><PowerOff size={16} className="mr-1" /> Désactiver</> : <><Power size={16} className="mr-1" /> Réactiver</>}
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(room.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up border border-white/50">
            <div className="flex justify-between items-center p-6 border-b border-gray-100/50">
              <h3 className="text-xl font-extrabold text-gray-900">Ajouter une salle</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRoom} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la salle</label>
                <input 
                  type="text" required
                  value={newRoom.nom}
                  onChange={(e) => setNewRoom({...newRoom, nom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-brown"
                  placeholder="Ex: Amphi 1, Salle TP 4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (places)</label>
                <input 
                  type="number" required min="1"
                  value={newRoom.capacite}
                  onChange={(e) => setNewRoom({...newRoom, capacite: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-brown"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipements</label>
                <input 
                  type="text" required
                  value={newRoom.equipements}
                  onChange={(e) => setNewRoom({...newRoom, equipements: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-brown"
                  placeholder="Ex: Projecteur, Ordinateurs, Tableau blanc..."
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-uca-green to-uca-light-green text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all font-semibold disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? 'Création...' : 'Créer la salle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomManagement;
