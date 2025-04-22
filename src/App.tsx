import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAssignment from "./pages/admin/AssignVolunteers";
import AdminEvents from "./pages/admin/Events";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import VolunteerDashboard from "./pages/volunteer/Dashboard";
import VolunteerEvents from "./pages/volunteer/Events";
import VolunteerProfile from "./pages/volunteer/Profile";
import FirstAidGuide from "./pages/volunteer/FirstAidGuide";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(API_BASE_URL);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/assign-volunteers" element={<AdminAssignment />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/events/create" element={<CreateEvent />} />
          <Route path="/admin/events/edit" element={<EditEvent />} />

          {/* Volunteer routes */}
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/events" element={<VolunteerEvents />} />
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
          <Route path="/volunteer/first-aid-guide" element={<FirstAidGuide />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

