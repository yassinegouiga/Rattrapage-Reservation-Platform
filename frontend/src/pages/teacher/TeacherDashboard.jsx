import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Construction, CalendarClock } from 'lucide-react';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up border border-gray-100">
        
        {/* Header with University Colors */}
        <div className="h-32 bg-uca-green relative">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full shadow-lg">
            <CalendarClock size={48} className="text-uca-brown" />
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {user?.nomComplet} !</h1>
            <p className="text-gray-500 mt-2">Vous êtes connecté en tant qu'Enseignant.</p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 flex flex-col items-center">
            <Construction size={40} className="text-orange-500 mb-4 animate-bounce" />
            <h2 className="text-xl font-bold text-orange-800">Espace en construction</h2>
            <p className="text-orange-700 mt-2 max-w-md">
              La plateforme de réservation des séances de rattrapage pour les enseignants est en cours de développement. 
              Vous pourrez bientôt consulter les salles disponibles et effectuer vos réservations ici.
            </p>
          </div>

          <div className="pt-4 flex justify-center">
            <button 
              onClick={logout}
              className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 hover:text-red-600 transition-colors shadow-sm"
            >
              <LogOut size={20} className="mr-2" />
              Se déconnecter et retourner à l'accueil
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default TeacherDashboard;
