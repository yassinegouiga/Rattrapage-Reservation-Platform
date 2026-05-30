import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Trash2, UserPlus, Mail, Shield, User, X } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ nomComplet: '', email: '', password: '', roles: ['ROLE_ENSEIGNANT'] });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await adminService.createUser(newUser);
      setUsers([...users, created]);
      setShowModal(false);
      setNewUser({ nomComplet: '', email: '', password: '', roles: ['ROLE_ENSEIGNANT'] });
    } catch (error) {
      alert("Erreur lors de la création de l'utilisateur. Vérifiez que l'email n'existe pas déjà.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Professeurs</h1>
          <p className="text-gray-500 mt-2 font-medium">Gérer les comptes enseignants</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center px-5 py-3 bg-gradient-to-r from-uca-green to-uca-light-green text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all whitespace-nowrap font-semibold"
        >
          <UserPlus size={18} className="mr-2" />
          Nouveau Professeur
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium border border-white/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nom Complet</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 font-medium text-gray-500">Chargement...</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-white/60 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <User size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.nomComplet}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={16} className="mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${user.roles.some(r => r.name === 'ROLE_ADMIN' || r === 'ROLE_ADMIN') ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      <Shield size={12} className="mr-1" />
                      {user.roles.map(r => (r.name || r).replace('ROLE_', '')).join(', ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up border border-white/50">
            <div className="flex justify-between items-center p-6 border-b border-gray-100/50">
              <h3 className="text-xl font-extrabold text-gray-900">Ajouter un professeur</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
                <input 
                  type="text" required
                  value={newUser.nomComplet}
                  onChange={(e) => setNewUser({...newUser, nomComplet: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-green"
                  placeholder="Ex: Pr. Mohammed"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" required
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-green"
                  placeholder="email@uca.ac.ma"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe temporaire</label>
                <input 
                  type="password" required minLength="6"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-green"
                  placeholder="Minimum 6 caractères"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
                <select 
                  value={newUser.roles[0]}
                  onChange={(e) => setNewUser({...newUser, roles: [e.target.value]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-uca-green"
                >
                  <option value="ROLE_ENSEIGNANT">Enseignant</option>
                  <option value="ROLE_ADMIN">Administrateur</option>
                </select>
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
                  {isSubmitting ? 'Création...' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
