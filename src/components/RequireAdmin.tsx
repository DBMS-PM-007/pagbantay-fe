import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RequireAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [redirect, setRedirect] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

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

  useEffect(() => {
    if (isAdmin === false) {
      toast.error("No admin access!");
      navigate("/volunteer", { state: { from: location }, replace: true });
    }
  }, [isAdmin, location, navigate]);

  if (!isLoaded || isAdmin === null) return <div>Checking Admin Access...</div>;
  if (!isSignedIn || redirect) return null;

  return <Outlet />;
}

