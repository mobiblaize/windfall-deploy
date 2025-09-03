import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./utils/helper/ProtectedRoute";

// Layouts
const MainLayout = lazy(() => import("./pages/Main"));

// Util
const ScrollUp = lazy(() => import("./utils/helper/ScrollUp"));

// Public pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Draws = lazy(() => import("./pages/draws/Draws"));
const RecentDraws = lazy(() => import("./pages/draws/RecentDraws"));
const SpecificResult = lazy(() => import("./pages/draws/SpecificResult"));
const AllWinnersPage = lazy(() => import("./pages/winners/AllWinnersPage"));
const RecentWinners = lazy(() => import("./pages/winners/RecentWinners"));
const AllPricesPage = lazy(() => import("./pages/prizes/AllPricesPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Cart = lazy(() => import("./pages/checkout/Cart"));
const CheckoutPage = lazy(() => import("./pages/checkout/CheckoutPage"));

// Raffles
const RaffleGames = lazy(() => import("./pages/raffles/RaffleGames"));
const RaffleDetails = lazy(() => import("./pages/raffles/RaffleDetails"));
const RaffleGroups = lazy(() => import("./pages/raffles/RaffleGroups"));
const RafflesPaymentReceipt = lazy(
  () => import("./pages/raffles/RafflesPaymentReceipt")
);

// Profile
const ProfileLayout = lazy(() => import("./pages/Profile/ProfileLayout"));
const GamesTickets = lazy(() => import("./pages/Profile/GamesTickets"));
const GamesTab = lazy(() => import("./pages/Profile/GamesTab"));
const ResultsTab = lazy(() => import("./pages/Profile/ResultsTab"));
const GameResultsTickets = lazy(
  () => import("./pages/Profile/GameResultsTickets")
);
const RewardTab = lazy(() => import("./pages/Profile/Reward/RewardTab"));
const TransactionsTab = lazy(() => import("./pages/Profile/TransactionsTab"));
const PaymentReceipt = lazy(() => import("./pages/Profile/PaymentReceipt"));

// Settings
const SettingsTab = lazy(() => import("./pages/Profile/settings/SettingsTab"));
const PersonalSettingsTab = lazy(
  () => import("./pages/Profile/settings/PersonalSettingsTab")
);
const AccountSecurity = lazy(
  () => import("./pages/Profile/settings/AccountSecurity/AccountSecurity")
);
const ChangePassword = lazy(
  () => import("./pages/Profile/settings/AccountSecurity/ChangePassword")
);
const NotificationSettingsTab = lazy(
  () => import("./pages/Profile/settings/NotificationSettingsTab")
);
const AllNotifications = lazy(() => import("./pages/Profile/AllNotifications"));

// Static pages
const ResponsiblePlaying = lazy(() => import("./pages/ResponsiblePlaying"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const GameRules = lazy(() => import("./pages/GameRules"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const TermsOfUse = lazy(() => import("./pages/TermsOfUse"));
const Faq = lazy(() => import("./pages/Faq"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const DownloadApp = lazy(() => import("./pages/DownloadApp"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const ClaimPrices = lazy(() => import("./pages/ClaimPrices/ClaimPrices"));

// Admin
const AdminLoginPage = lazy(() => import("./pages/Admin/AdminLogin"));
const UserManagement = lazy(() => import("./pages/Admin/UserMgt/UserMgt"));
const UserDetails = lazy(() => import("./pages/Admin/UserMgt/UserDetails"));
const CreateUser = lazy(() => import("./pages/Admin/UserMgt/CreateUser"));
const EditUser = lazy(() => import("./pages/Admin/UserMgt/EditUser"));

const RoleManagement = lazy(() => import("./pages/Admin/RoleMgt/RoleMgt"));
const CreateRole = lazy(() => import("./pages/Admin/RoleMgt/CreateRole"));
const EditRole = lazy(() => import("./pages/Admin/RoleMgt/EditRole"));
const RoleDetails = lazy(() => import("./pages/Admin/RoleMgt/RoleDetails"));

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = user.id;

  console.log(isAuthenticated);

  return (
    <BrowserRouter>
      <ScrollUp />
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Public routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<Signup />} />
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* Draws */}
            <Route path="draws" element={<Draws />} />
            <Route path="draws/recent" element={<RecentDraws />} />
            <Route path="winners/all-time" element={<AllWinnersPage />} />
            <Route path="winners/recent" element={<RecentWinners />} />
            <Route path="winners/all-time/:id" element={<SpecificResult />} />

            {/* Profile grouped */}
            <Route path="profile" 
              element={
                <ProtectedRoute>
                  <ProfileLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Navigate to="all-games" replace />} />
              <Route path="all-games" element={<GamesTab />} />
              <Route path="all-games/:id" element={<GamesTickets />} />
              <Route path="result" element={<ResultsTab />} />
              <Route path="result/:id" element={<GameResultsTickets />} />
              <Route path="reward" element={<RewardTab />} />
              <Route path="transaction" element={<TransactionsTab />} />
              <Route path="transaction/:id" element={<PaymentReceipt />} />
              <Route path="notifications" element={<AllNotifications />} />

              {/* Settings nested inside profile */}
              <Route path="settings" element={<SettingsTab />} />
              <Route
                path="settings/personal"
                element={<PersonalSettingsTab />}
              />
              <Route
                path="settings/notification"
                element={<NotificationSettingsTab />}
              />
              <Route path="settings/account" element={<AccountSecurity />} />
              <Route
                path="settings/change-password"
                element={<ChangePassword />}
              />
            </Route>

            {/* Raffles */}
            <Route path="raffles" element={<RaffleGames />} />
            <Route path="raffles/:id" element={<RaffleDetails />} />
            <Route
              path="raffles/receipts"
              element={<RafflesPaymentReceipt />}
            />
            <Route path="raffles/receipts/:id" element={<RaffleGroups />} />

            <Route path="prize" element={<AllPricesPage />} />

            {/* Static pages */}
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
            <Route path="checkout/signup" element={<Signup />} />
            <Route
              path="responsible-playing"
              element={<ResponsiblePlaying />}
            />
            <Route path="game-rules" element={<GameRules />} />
            <Route
              path="terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="faq" element={<Faq />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="cookie-policy" element={<CookiePolicy />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="terms-of-use" element={<TermsOfUse />} />
            <Route path="claim-prices" element={<ClaimPrices />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="download-app" element={<DownloadApp />} />

            {/* Admin grouped */}
            <Route path="admin">
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="login" element={<AdminLoginPage />} />

              <Route path="users" element={<UserManagement />} />

              <Route path="users/create" element={<CreateUser />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="users/edit/:id" element={<EditUser />} />
              <Route path="roles" element={<RoleManagement />} />
              <Route path="roles/create" element={<CreateRole />} />
              <Route path="roles/:id" element={<RoleDetails />} />
              <Route path="roles/edit/:id" element={<EditRole />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
