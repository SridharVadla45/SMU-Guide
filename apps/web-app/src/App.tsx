import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastContainer } from './components/Toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Mentors from './pages/Mentors';
import Appointments from './pages/Appointments';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import MentorProfilePage from './pages/MentorProfile';
import QuestionDetail from './pages/QuestionDetail';

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><Layout><Outlet /></Layout></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentors" element={<Mentors />} />
            <Route path="/mentors/:id" element={<MentorProfilePage />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/questions/:id" element={<QuestionDetail />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
