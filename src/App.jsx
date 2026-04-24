import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './features/auth/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<Navigate to="/auth" replace />} />
        {/* Future routes like /admin, /student, etc. will be added here */}
      </Routes>
    </Router>
  );
}

export default App;
