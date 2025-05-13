import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

export default function AppLayout({ type }: { type: "admin" | "volunteer" }) {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;

    if (type === "admin") {
      if (path === "/admin") return "Dashboard";
      if (path.startsWith("/admin/events/create")) return "Create Event";
      if (path.startsWith("/admin/events/edit")) return "Edit Event";
      if (path.startsWith("/admin/events")) return "Events";
      if (path.startsWith("/admin/assign-volunteers")) return "Assign Volunteers";
      if (path.startsWith("/admin/emergency")) return "Emergency";
    }

    if (type === "volunteer") {
      if (path === "/volunteer") return "Dashboard";
      if (path.startsWith("/volunteer/events")) return "Events";
      if (path.startsWith("/volunteer/profile")) return "Profile";
      if (path.startsWith("/volunteer/guide")) return "First Aid Guide";
    }

    return "";
  };

  return (
    <>
      <Header title={getTitle()} />
      <main className="flex flex-col justify-center">
        <Outlet />
      </main>
      <BottomNav type={type} />
    </>
  );
}

