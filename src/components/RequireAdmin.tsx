import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RequireAdmin() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const email = user?.primaryEmailAddress?.emailAddress;

      if (!email) {
        toast.error("Email not found.");
        navigate("/volunteer", { state: { from: location }, replace: true });
        return;
      }

      const fetchUserID = async () => {
        try {
          const response = await axios.get(`${API_URL}/users/email/${email}`);
          setUserID(response.data.user_id);
        } catch (error) {
          console.error("Failed to query user by email", error);
          toast.error("Error fetching user details");
          navigate("/volunteer", { state: { from: location }, replace: true });
        }
      };

      fetchUserID();
    }
  }, [isLoaded, isSignedIn, user, location, navigate, API_URL]);

  useEffect(() => {
    if (userID) {
      const checkAdmin = async () => {
        try {
          const response = await axios.get(`${API_URL}/admin/${userID}`);
          setIsAdmin(response.data);
        } catch (error) {
          console.error("Failed to check admin access", error);
          setIsAdmin(false);
        }
      };
      checkAdmin();
    }
  }, [userID, API_URL]);

  useEffect(() => {
    if (isAdmin === false) {
      toast.error("No admin access!");
      navigate("/volunteer", { state: { from: location }, replace: true });
    }
  }, [isAdmin, location, navigate]);

  if (!isLoaded || isAdmin === null) {
    return <div>Checking Admin Access...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

