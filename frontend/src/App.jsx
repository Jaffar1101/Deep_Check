import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DeepfakeVerifier from './components/dashboard/DeepfakeVerifier';
import NewsVerifier from './components/dashboard/NewsVerifier';
import ContentChecker from './components/dashboard/ContentChecker';
import ToolsPage from './components/dashboard/ToolsPage';
import HistoryPage from './components/dashboard/HistoryPage';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<PublicOnlyRoute><SignInPage /></PublicOnlyRoute>} />
            <Route path="/signup" element={<PublicOnlyRoute><SignInPage /></PublicOnlyRoute>} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/dashboard/deepfake" replace />} />
              <Route path="deepfake" element={<DeepfakeVerifier />} />
              <Route path="news" element={<NewsVerifier />} />
              <Route path="content" element={<ContentChecker />} />
              <Route path="tools" element={<Navigate to="/dashboard/tools/text" replace />} />
              <Route path="tools/:toolType" element={<ToolsPage />} />
              <Route path="history" element={<HistoryPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
