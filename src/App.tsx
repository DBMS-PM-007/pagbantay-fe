import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import SignInPage from './pages/Sign-In'
import RequireAuth from './components/RequireAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(API_BASE_URL);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

