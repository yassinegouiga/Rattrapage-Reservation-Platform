import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import RoomManagement from './pages/admin/RoomManagement';
import ReservationSupervision from './pages/admin/ReservationSupervision';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import BookRoom from './pages/teacher/BookRoom';
import MyReservations from './pages/teacher/MyReservations';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Routes Administrateur enveloppées par le Layout (Sidebar) */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="reservations" element={<ReservationSupervision />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>
          
          {/* Route Enseignant */}
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute requiredRole="ROLE_ENSEIGNANT">
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="book" element={<BookRoom />} />
            <Route path="reservations" element={<MyReservations />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
