import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NGOPanel from "./pages/NGOPanel";
import NewDonation from "./pages/NewDonation";
import AboutUs from "./pages/AboutUs";
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

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Redirect to Landing Page */}
        <Route path="/home" element={<Navigate to="/landing" replace />} />{" "}
        {/* Redirect /home to /landing */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/ngo"
          element={
            <PrivateRoute>
              <NGOPanel />
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
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/description" element={<Description />} />
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
        <Route
          path="/admin/donors"
          element={
            <PrivateRoute>
              <Donors />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/ngos"
          element={
            <PrivateRoute>
              <NGOs />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
