import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trash2, Plus, Monitor, Power, PowerOff, X } from 'lucide-react';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRoom, setNewRoom] = useState({ nom: '', capacite: 30, equipements: '', estDisponible: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      const data = await adminService.getAllRooms();
      setRooms(data);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salles</h1>
          <p className="text-gray-500 mt-1">Gérer les salles et leur disponibilité</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-uca-brown text-white rounded-lg hover:bg-uca-light-brown shadow-md transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Nouvelle Salle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Chargement...</p>
        ) : rooms.map((room) => (
          <div key={room.id} className={`bg-white rounded-xl shadow-sm border ${room.estDisponible ? 'border-gray-100' : 'border-red-200 bg-red-50'} overflow-hidden transition-all duration-200 hover:shadow-md`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{room.nom}</h3>
                  <p className="text-sm text-gray-500 mt-1">Capacité: {room.capacite} places</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${room.estDisponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {room.estDisponible ? 'DISPONIBLE' : 'HORS SERVICE'}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Monitor size={16} className="mr-2 text-gray-400" />
                  {room.equipements}
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

      {/* Modal Ajout Salle */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Ajouter une salle</h3>
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

              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-uca-brown text-white rounded-lg hover:bg-uca-light-brown transition-colors disabled:opacity-50"
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
