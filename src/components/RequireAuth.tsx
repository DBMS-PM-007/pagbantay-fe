import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function RequireAuth() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;

  return isSignedIn ? <Outlet /> : <Navigate to="/sign-in" />;
}

