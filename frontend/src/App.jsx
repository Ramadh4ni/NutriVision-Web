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
import RecipeDetail from "./pages/Recipe/RecipeDetail";
import Recipe from "./pages/Recipe/Recipe";
import Settings from "./pages/Settings/Settings";
import Onboarding from "./pages/Onboarding/Onboarding";
import { RecipeProvider } from "./context/RecipeContext";
import { UserProvider, useUser } from "./context/UserContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  if (isLoading) {
    return null;
  }
  if (isAuthenticated) {
    return <Navigate to={hasCompletedOnboarding ? "/dashboard" : "/onboarding"} replace />;
  }
  return children;
}

function OnboardingRoute({ children }) {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();
  if (isLoading) {
    return null;
  }
  if (isAuthenticated && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function AuthHydrator() {
  const { profile, isAuthenticated } = useAuth();
  const { hydrateFromAuth } = useUser();
  const prevProfile = useRef(null);

  useEffect(() => {
    if (prevProfile.current !== profile) {
      prevProfile.current = profile;
      hydrateFromAuth(isAuthenticated ? profile : null);
    }
  }, [isAuthenticated, profile, hydrateFromAuth]);

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
