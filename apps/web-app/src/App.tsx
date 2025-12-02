import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Mentors from './pages/Mentors';
import Appointments from './pages/Appointments';
import Forum from './pages/Forum';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import MentorProfilePage from './pages/MentorProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout><Outlet /></Layout>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/mentors/:id" element={<MentorProfilePage />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
