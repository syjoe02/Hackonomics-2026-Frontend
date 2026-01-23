import type { ReactNode } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/auth/AuthContext";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OAuthCallbackPage from "./pages/OAuthCallbackPage"
import MyPage from "./pages/MyPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken, loading } = useAuth();
  if (loading) return null;
  if (!accessToken) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();
  if (accessToken) return <Navigate to="/me" replace />;
  return children;
}
// Routers
export default function AppRouter() {
  return (
    <AuthProvider>
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Public */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />

        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Protected */}
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}