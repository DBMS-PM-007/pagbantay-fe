import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RemoveTrailingSlash() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const { pathname, search, hash } = location;
    if (pathname !== "/" && pathname.endsWith("/")) {
      const newPath = pathname.slice(0, -1) + search + hash;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

