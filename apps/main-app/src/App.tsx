import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./utils/helper/ProtectedRoute";
import AdminProtectedRoute from "./utils/helper/AdminProtectedRoute";

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
const CheckoutAuth = lazy(() => import("./pages/checkout/CheckoutAuth"));
const RedirectOrderDetails = lazy(
  () => import("./components/RedirectOrderDetails")
);

// Raffles
const RaffleGames = lazy(() => import("./pages/raffles/RaffleGames"));
const RaffleDetails = lazy(() => import("./pages/raffles/RaffleDetails"));
// const RaffleGroups = lazy(() => import("./pages/raffles/RaffleGroups"));
// const RafflesPaymentReceipt = lazy(
//   () => import("./pages/raffles/RafflesPaymentReceipt")
// );

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
const AdminLoginPage = lazy(() => import("./pages/Admin/Auth/AdminLogin"));
const AdminResetPasswordPage = lazy(
  () => import("./pages/Admin/Auth/AdminResetPassword")
);
const AdminChangePasswordPage = lazy(
  () => import("./pages/Admin/Auth/AdminChangePassword")
);
const VerifyEmailPage = lazy(() => import("./pages/Admin/Auth/VerifyEmail"));
const UserManagement = lazy(() => import("./pages/Admin/UserMgt/UserMgt"));
const UserDetails = lazy(() => import("./pages/Admin/UserMgt/UserDetails"));
const CreateUser = lazy(() => import("./pages/Admin/UserMgt/CreateUser"));
const EditUser = lazy(() => import("./pages/Admin/UserMgt/EditUser"));

const RoleManagement = lazy(() => import("./pages/Admin/RoleMgt/RoleMgt"));
const CreateRole = lazy(() => import("./pages/Admin/RoleMgt/CreateRole"));
const EditRole = lazy(() => import("./pages/Admin/RoleMgt/EditRole"));
const RoleDetails = lazy(() => import("./pages/Admin/RoleMgt/RoleDetails"));

const RaffleManagement = lazy(
  () => import("./pages/Admin/GameMgt/RaffleManagement")
);
const RaffleList = lazy(() => import("./pages/Admin/GameMgt/RaffleList"));
const ViewRaffles = lazy(() => import("./pages/Admin/GameMgt/ViewRaffles"));
const CreateLayout = lazy(
  () => import("./pages/Admin/CreateRaffle/CreateLayout")
);

const Support = lazy(() => import("./pages/Admin/Support/Support"));
const ViewComplaint = lazy(() => import("./pages/Admin/Support/ViewComplaint"));

const PromoCode = lazy(() => import("./pages/Admin/PromoCode/PromoCode"));
const CreatePromoCode = lazy(
  () => import("./pages/Admin/PromoCode/CreatePromoCode")
);
const ViewPromoCode = lazy(
  () => import("./pages/Admin/PromoCode/ViewPromoCode")
);

const AuditTrail = lazy(() => import("./pages/Admin/AuditTrail/AuditTrail"));

const TransactionDashboard = lazy(
  () => import("./pages/Admin/TransactionMgt/TransactionDashboard")
);
const TransactionList = lazy(
  () => import("./pages/Admin/TransactionMgt/TransactionList")
);

const CustomerDashboard = lazy(
  () => import("./pages/Admin/CustomerMgt/CustomerDashboard")
);

const Notifications = lazy(
  () => import("./pages/Admin/Notifications/Notifications")
);

function App() {
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reset-password" element={<ResetPassword />} />

            {/* Draws */}
            <Route path="draws" element={<Draws />} />
            <Route path="draws/recent" element={<RecentDraws />} />

            {/* winners */}
            <Route path="winners/all-time" element={<AllWinnersPage />} />
            <Route path="winners/recent" element={<RecentWinners />} />
            <Route path="winners/all-time/:id" element={<SpecificResult />} />

            {/* Profile grouped */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfileLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="all-games" replace />} />
              <Route path="all-games" element={<GamesTab />} />
              <Route path="all-games/:id" element={<GamesTickets />} />
              <Route path="result" element={<ResultsTab />} />
              <Route path="result/:id" element={<GameResultsTickets />} />
              <Route path="reward" element={<RewardTab />} />
              <Route path="transaction" element={<TransactionsTab />} />
              <Route path="transaction/:id" element={<PaymentReceipt />} />
              <Route
                path="transaction/receipt/:id"
                element={<PaymentReceipt />}
              />
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
            {/* <Route
              path="raffles/receipts"
              element={<RafflesPaymentReceipt />}
            />
            <Route path="raffles/receipts/:id" element={<RaffleGroups />} /> */}

            <Route path="prize" element={<AllPricesPage />} />

            {/* Static pages */}
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="checkout/signup" element={<CheckoutAuth />} />

            <Route path="/payment-success" element={<RedirectOrderDetails />} />
            <Route path="/payment-failed" element={<RedirectOrderDetails />} />

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
              {/* Public admin login */}
              <Route path="login" element={<AdminLoginPage />} />
              <Route
                path="reset-password"
                element={<AdminResetPasswordPage />}
              />
              <Route path="verify-email/:id" element={<VerifyEmailPage />} />
              <Route
                path="change-password/:id"
                element={<AdminChangePasswordPage />}
              />

              {/* Protected admin routes */}
              <Route
                element={
                  <AdminProtectedRoute>
                    <Outlet />
                  </AdminProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />

                {/* User Management */}
                <Route path="users" element={<UserManagement />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="users/:id" element={<UserDetails />} />
                <Route path="users/edit/:id" element={<EditUser />} />

                {/* Role Management */}
                <Route path="roles" element={<RoleManagement />} />
                <Route path="roles/create" element={<CreateRole />} />
                <Route path="roles/:id" element={<RoleDetails />} />
                <Route path="roles/edit/:id" element={<EditRole />} />

                <Route path="raffles" element={<RaffleManagement />} />
                <Route path="raffles/all" element={<RaffleList />} />
                <Route path="raffles/:id" element={<ViewRaffles />} />
                <Route path="raffles/create" element={<CreateLayout />} />

                {/* Customer Support */}
                <Route path="support" element={<Support />} />
                <Route path="support/:id" element={<ViewComplaint />} />

                {/* Promo Code */}
                <Route path="promo-codes">
                  <Route index element={<PromoCode />} />
                  <Route path="create" element={<CreatePromoCode />} />
                  <Route path=":id" element={<ViewPromoCode />} />
                </Route>

                {/* Audit Trail */}
                <Route path="audit" element={<AuditTrail />} />

                {/* Customers */}
                <Route path="customers" element={<CustomerDashboard />} />

                {/* Notifications */}
                <Route path="notifications" element={<Notifications />} />

                {/* Transactions */}
                <Route path="transactions">
                  <Route index element={<TransactionDashboard />} />
                  <Route path="all" element={<TransactionList />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
