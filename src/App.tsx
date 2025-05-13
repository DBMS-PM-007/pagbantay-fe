import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "@components/RequireAuth";
import RequireAdmin from "@components/RequireAdmin";
import LoggedIn from "@components/LoggedIn";
import Home from "@pages/Home";
import SignInPage from "@pages/SignInPage";
import SignUpPage from "@pages/SignUpPage";
import AdminDashboard from "@pages/admin/Dashboard";
import AssignVolunteers from "@pages/admin/AssignVolunteers";
import AdminEvents from "@pages/admin/Events";
import CreateEvent from "@pages/admin/CreateEvent";
import EditEvent from "@pages/admin/EditEvent";
import VolunteerDashboard from "@pages/volunteer/Dashboard";
import VolunteerEvents from "@pages/volunteer/Events";
import VolunteerProfile from "@pages/volunteer/Profile";
import FirstAidGuide from "@pages/volunteer/FirstAidGuide";
import { ToastContainer } from "react-toastify";
import AppLayout from "@components/AppLayout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route element={<RequireAdmin />}>
              <Route element={<AppLayout type="admin" />}>
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/assign-volunteers" element={<AssignVolunteers />} />
                <Route path="/admin/events" element={<AdminEvents />} />
                <Route path="/admin/events/create" element={<CreateEvent />} />
                <Route path="/admin/events/edit" element={<EditEvent />} />
              </Route>
            </Route>

            {/* Volunteer routes */}
            <Route element={<AppLayout type="volunteer" />}>
              <Route path="/volunteer" element={<VolunteerDashboard />} />
              <Route path="/volunteer/events" element={<VolunteerEvents />} />
              <Route path="/volunteer/profile" element={<VolunteerProfile />} />
              <Route path="/volunteer/guide" element={<FirstAidGuide />} />
            </Route>
          </Route>

          {/* Public routes */}
          <Route element={<LoggedIn />}>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

