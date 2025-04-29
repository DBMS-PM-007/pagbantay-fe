import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

export default function LoggedIn() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return isSignedIn ? <Navigate to="/volunteer" /> : <Outlet />;
}

