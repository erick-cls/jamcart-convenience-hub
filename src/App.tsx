import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MaintenanceProvider, useMaintenanceMode } from "@/context/MaintenanceContext";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import CategoryPage from "./pages/CategoryPage";
import OrderPage from "./pages/OrderPage";
import Categories from "./pages/Categories";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import OrdersPage from "./pages/admin/orders/OrdersPage";
import UsersPage from "./pages/admin/users/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersHistoryPage from "./pages/OrdersHistoryPage";
import NotFound from "./pages/NotFound";
import RiderLayout from "./components/rider/RiderLayout";
import RiderDashboard from "./pages/rider/Dashboard";
import RiderOrdersPage from "./pages/rider/OrdersPage";
import RiderProfilePage from "./pages/rider/ProfilePage";
import ThankYouPage from "./pages/ThankYouPage";
import MaintenancePage from "./pages/MaintenancePage";
import RidersManagement from "./pages/admin/riders/RidersManagement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route guard for maintenance mode
const MaintenanceGuard = ({ children }: { children: React.ReactNode }) => {
  const { isMaintenanceMode, isAdmin } = useMaintenanceMode();
  
  if (isMaintenanceMode && !isAdmin) {
    return <Navigate to="/maintenance" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <MaintenanceProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes accessible even during maintenance */}
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes that redirect to maintenance when active */}
            <Route path="/" element={
              <MaintenanceGuard>
                <LandingPage />
              </MaintenanceGuard>
            } />
            <Route path="/categories" element={
              <MaintenanceGuard>
                <Categories />
              </MaintenanceGuard>
            } />
            <Route path="/category/:categoryId" element={
              <MaintenanceGuard>
                <CategoryPage />
              </MaintenanceGuard>
            } />
            <Route path="/order/:categoryId/:storeId" element={
              <MaintenanceGuard>
                <OrderPage />
              </MaintenanceGuard>
            } />
            <Route path="/order/thank-you/:orderId?" element={
              <MaintenanceGuard>
                <ThankYouPage />
              </MaintenanceGuard>
            } />
            {/* Add the new route for /thankyou/:orderId */}
            <Route path="/thankyou/:orderId?" element={
              <MaintenanceGuard>
                <ThankYouPage />
              </MaintenanceGuard>
            } />
            <Route path="/how-it-works" element={
              <MaintenanceGuard>
                <HowItWorks />
              </MaintenanceGuard>
            } />
            <Route path="/about" element={
              <MaintenanceGuard>
                <About />
              </MaintenanceGuard>
            } />
            <Route path="/profile" element={
              <MaintenanceGuard>
                <ProfilePage />
              </MaintenanceGuard>
            } />
            <Route path="/orders" element={
              <MaintenanceGuard>
                <OrdersHistoryPage />
              </MaintenanceGuard>
            } />
            
            {/* Admin routes with layout - always accessible */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="riders" element={<RidersManagement />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Rider routes with layout */}
            <Route path="/rider" element={<RiderLayout />}>
              <Route path="dashboard" element={<RiderDashboard />} />
              <Route path="orders" element={<RiderOrdersPage />} />
              <Route path="profile" element={<RiderProfilePage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MaintenanceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
