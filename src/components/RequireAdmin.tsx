import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RequireAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const toastShown = useRef(false);
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const checkAdmin = async () => {
        try {
          const response = await axios.get(`${API_URL}/admin/${user.id}`);
          setIsAdmin(response.data);
        } catch (error) {
          console.error("Failed to check admin access", error);
          setIsAdmin(false);
        }
      };
      checkAdmin();
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || isAdmin === null) return "Checking Admin Access...";

  if (!isSignedIn || !isAdmin) {
    if (!toastShown.current) {
      toastShown.current = true;
      toast.error("No admin access!");
    }
    return <Navigate to="/volunteer" state={{ from: location }} replace />;
  }

  return <Outlet />;
}


