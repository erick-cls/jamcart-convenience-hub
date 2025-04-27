
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import CategoryPage from "./pages/CategoryPage";
import OrderPage from "./pages/OrderPage";
import AuthPage from "./pages/AuthPage";
import ThankYouPage from "./pages/ThankYouPage";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import ProfilePage from "./pages/ProfilePage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";
import VendorDashboardPage from "./pages/VendorDashboardPage";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import UsersPage from "./pages/admin/users/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";

// Rider Pages
import RiderDashboard from "./pages/rider/Dashboard";
import RiderOrdersPage from "./pages/rider/OrdersPage";
import RiderProfilePage from "./pages/rider/ProfilePage";

import { AuthProvider } from "./context/AuthContext";
import { MaintenanceProvider } from "./context/MaintenanceContext";
import MaintenancePage from "./pages/MaintenancePage";
import "./App.css";

function App() {
  return (
    <MaintenanceProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/order/:categoryId/:storeId" element={<OrderPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersHistoryPage />} />
          <Route path="/vendor" element={<VendorDashboardPage />} />
          <Route path="/thankyou/:orderId" element={<ThankYouPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/orders" element={<OrdersPage />} />
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          
          {/* Rider Routes */}
          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/orders" element={<RiderOrdersPage />} />
          <Route path="/rider/profile" element={<RiderProfilePage />} />
          
          {/* Maintenance and NotFound */}
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </MaintenanceProvider>
  );
}

export default App;
