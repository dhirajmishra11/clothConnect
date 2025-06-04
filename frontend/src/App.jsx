import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { ThemeProvider } from "./components/common/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NGOPanel from "./pages/NGOPanel";
import NewDonation from "./pages/NewDonation";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Description from "./pages/Description";
import NotFound from "./pages/NotFound";
import ProfileEdit from "./pages/ProfileEdit";
import MyDonations from "./pages/MyDonations";
import PendingDonations from "./pages/PendingDonations";
import Pickups from "./pages/Pickups";
import Collection from "./pages/Collection";
import Donated from "./pages/Donated";
import Donors from "./pages/Donors";
import NGOs from "./pages/NGOs";
import Home from "./pages/Home"; // Import the new Home page
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Donations from "./pages/Donations";
import EmailVerification from "./pages/EmailVerification"; // Import EmailVerification page
import ImpactPage from "./pages/ImpactPage"; // Import ImpactPage
import Analytics from "./pages/Analytics";
import AdminPanel from "./pages/AdminPanel";

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

// Private Route Component that also checks for admin role
const AdminRoute = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  return token && user?.role === "admin" ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} /> {/* Redirect to Landing Page */}
          <Route path="/home" element={<Navigate to="/landing" replace />} />{" "}
          {/* Redirect /home to /landing */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} /> {/* Email verification route */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/description" element={<Description />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/donations" element={<Donations />} />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/new-donation"
            element={
              <PrivateRoute>
                <NewDonation />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-edit"
            element={
              <PrivateRoute>
                <ProfileEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-donations"
            element={
              <PrivateRoute>
                <MyDonations />
              </PrivateRoute>
            }
          />
          <Route
            path="/impact"
            element={
              <PrivateRoute>
                <ImpactPage />
              </PrivateRoute>
            }
          />

          {/* Protected NGO Routes */}
          <Route
            path="/ngo"
            element={
              <PrivateRoute>
                <NGOPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="/ngo/pending-donations"
            element={
              <PrivateRoute>
                <PendingDonations />
              </PrivateRoute>
            }
          />
          <Route
            path="/ngo/pickups"
            element={
              <PrivateRoute>
                <Pickups />
              </PrivateRoute>
            }
          />
          <Route
            path="/ngo/collection"
            element={
              <PrivateRoute>
                <Collection />
              </PrivateRoute>
            }
          />
          <Route
            path="/ngo/donated"
            element={
              <PrivateRoute>
                <Donated />
              </PrivateRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/donors"
            element={
              <AdminRoute>
                <Donors />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ngos"
            element={
              <AdminRoute>
                <NGOs />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pending-donations"
            element={
              <AdminRoute>
                <PendingDonations />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
