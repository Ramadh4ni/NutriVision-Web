import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useRef } from "react";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import ScanFood from "./pages/ScanFood/ScanFood";
import Recommendation from "./pages/Recommendation/Recommendation";
import Recipe from "./pages/Recipe/Recipe";
import RecipeDetail from "./pages/Recipe/RecipeDetail";
import Settings from "./pages/Settings/Settings";
import Onboarding from "./pages/Onboarding/Onboarding";
import { RecipeProvider } from "./context/RecipeContext";
import { UserProvider, useUser } from "./context/UserContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, activeUserId, users } = useAuth();
  if (!isAuthenticated || !activeUserId) {
    return <Navigate to="/login" replace />;
  }
  if (!users[activeUserId]?.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function OnboardingRoute({ children }) {
  const { isAuthenticated, activeUserId, users } = useAuth();
  if (
    isAuthenticated &&
    activeUserId &&
    users[activeUserId]?.hasCompletedOnboarding
  ) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AuthHydrator() {
  const { isAuthenticated, activeUserId, users } = useAuth();
  const { hydrateFromAuth } = useUser();
  const prevUserId = useRef(null);

  useEffect(() => {
    if (prevUserId.current !== activeUserId) {
      prevUserId.current = activeUserId;

      if (isAuthenticated && activeUserId) {
        hydrateFromAuth(users[activeUserId] || null);
      } else {
        hydrateFromAuth(null);
      }
    }
  }, [isAuthenticated, activeUserId, users, hydrateFromAuth]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RecipeProvider>
          <AuthHydrator />
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <Login />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <Register />
                  </GuestRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <OnboardingRoute>
                    <Onboarding />
                  </OnboardingRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan-food"
                element={
                  <ProtectedRoute>
                    <ScanFood />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recommendation"
                element={
                  <ProtectedRoute>
                    <Recommendation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <Recipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipe/:id"
                element={
                  <ProtectedRoute>
                    <RecipeDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </RecipeProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
