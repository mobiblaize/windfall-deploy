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
import PermissionProtectedRoute from "./utils/helper/PermissionProtectedRoute";

// Layouts
const MainLayout = lazy(() => import("./pages/Main"));

// Util
const ScrollUp = lazy(() => import("./utils/helper/ScrollUp"));

// Public pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Draws = lazy(() => import("./pages/draws/Draws"));
const SpecificResult = lazy(() => import("./pages/winners/WinnerStory"));
const AllWinnersPage = lazy(() => import("./pages/winners/AllWinnersPage"));
const AllPrizesPage = lazy(() => import("./pages/prizes/AllPrizesPage"));
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
const CreateRaffleLayout = lazy(
  () => import("./pages/Admin/CreateRaffle/CreateRaffleLayout")
);
const EditRaffleLayout = lazy(
  () => import("./pages/Admin/CreateRaffle/EditRaffleLayout")
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

const CustomerDetails = lazy(
  () => import("./pages/Admin/CustomerMgt/CustomerDetails")
);

const Referrals = lazy(
  () => import("./pages/Admin/Referrals/Referrals")
);

const Reports = lazy(
  () => import("./pages/Admin/Reports/Reports")
);

const PrizeClaims = lazy(
  () => import("./pages/Admin/PrizeClaims/PrizeClaims")
);

const ProcessClaim = lazy(
  () => import("./pages/Admin/PrizeClaims/ProcessClaim")
);

const Notifications = lazy(
  () => import("./pages/Admin/Notifications/Notifications")
);

const DrawsOverview = lazy(
  () => import("./pages/Admin/DrawMgt/DrawsOverview")
);

const ViewDraw = lazy(
  () => import("./pages/Admin/DrawMgt/ViewDraw")
);

const PrizeManagement = lazy(
  () => import("./pages/Admin/PrizeManagement/PrizeManagement")
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

            {/* winners */}
            <Route path="winners" element={<AllWinnersPage />} />
            <Route path="winners/:id" element={<SpecificResult />} />

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

            <Route path="prize" element={<AllPrizesPage />} />

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

            <Route path="/payment-receipt" element={<RedirectOrderDetails />} />

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
                <Route index element={<Navigate to="raffles" replace />} />
                {/* <Route path="dashboard" element={<Dashboard />} /> */}

                {/* User Management */}
                <Route path="users">
                  <Route index element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-view"><UserManagement /></PermissionProtectedRoute>} />
                  <Route path="create" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-edit"><CreateUser /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-view"><UserDetails /></PermissionProtectedRoute>} />
                  <Route path="edit/:id" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-edit"><EditUser /></PermissionProtectedRoute>} />
                </Route>

                {/* Role Management */}
                <Route path="roles">
                  <Route index element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-view"><RoleManagement /></PermissionProtectedRoute>} />
                  <Route path="create" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-edit"><CreateRole /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-view"><RoleDetails /></PermissionProtectedRoute>} />
                  <Route path="edit/:id" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-edit"><EditRole /></PermissionProtectedRoute>} />
                </Route>


                <Route path="raffles">
                  <Route index element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><RaffleManagement /></PermissionProtectedRoute>} />
                  <Route path="all" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><RaffleList /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><ViewRaffles /></PermissionProtectedRoute>} />
                  <Route path="create" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-edit"><CreateRaffleLayout /></PermissionProtectedRoute>} />
                  <Route path="edit/:id" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-edit"><EditRaffleLayout /></PermissionProtectedRoute>} />
                </Route>

                <Route path="instant-raffles">
                  <Route index element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><RaffleManagement /></PermissionProtectedRoute>} />
                  <Route path="all" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><RaffleList /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-view"><ViewRaffles /></PermissionProtectedRoute>} />
                  <Route path="create" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-edit"><CreateRaffleLayout /></PermissionProtectedRoute>} />
                  <Route path="edit/:id" element={<PermissionProtectedRoute requiredModule="Game Management" requiredPermission="game-management-edit"><EditRaffleLayout /></PermissionProtectedRoute>} />
                </Route>

                {/* Customer Support */}
                <Route path="support">
                  <Route index element={<PermissionProtectedRoute requiredModule="Customer Support" requiredPermission="customer-support-view"><Support /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Customer Support" requiredPermission="customer-support-view"><ViewComplaint /></PermissionProtectedRoute>} />
                </Route>

                {/* Promo Code */}
                <Route path="promo-codes">
                  <Route index element={<PermissionProtectedRoute requiredModule="Promo Code Management" requiredPermission="promo-code-management-view"><PromoCode /></PermissionProtectedRoute>} />
                  <Route path="create" element={<PermissionProtectedRoute requiredModule="Promo Code Management" requiredPermission="promo-code-management-edit"><CreatePromoCode /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Promo Code Management" requiredPermission="promo-code-management-view"><ViewPromoCode /></PermissionProtectedRoute>} />
                </Route>

                {/* Audit Trail */}
                <Route path="audit" element={<PermissionProtectedRoute requiredModule="User Management" requiredPermission="user-management-view"><AuditTrail /></PermissionProtectedRoute>} />

                {/* Customers */}
                <Route path="customers">
                  <Route index element={<PermissionProtectedRoute requiredModule="Customer Management" requiredPermission="customer-management-view"><CustomerDashboard /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Customer Management" requiredPermission="customer-management-view"><CustomerDetails /></PermissionProtectedRoute>} />
                </Route>

                {/* Notifications */}
                <Route path="notifications" element={<PermissionProtectedRoute requiredModule="Notification" requiredPermission="notification-view"><Notifications /></PermissionProtectedRoute>} />

                {/* Referrals */}
                <Route path="referrals" element={<PermissionProtectedRoute requiredModule="Referral Management" requiredPermission="referral-management-view"><Referrals /></PermissionProtectedRoute>} />

                {/* Reports */}
                <Route path="reports" element={<PermissionProtectedRoute requiredModule="Report Management" requiredPermission="report-management-view"><Reports /></PermissionProtectedRoute>} />

                {/* Transactions */}
                <Route path="transactions">
                  <Route index element={<PermissionProtectedRoute requiredModule="Transaction Management" requiredPermission="transaction-management-view"><TransactionDashboard /></PermissionProtectedRoute>} />
                  <Route path="all" element={<PermissionProtectedRoute requiredModule="Transaction Management" requiredPermission="transaction-management-view"><TransactionList /></PermissionProtectedRoute>} />
                </Route>

                {/* Draws */}
                <Route path="draws">
                  <Route index element={<PermissionProtectedRoute requiredModule="Draw Management" requiredPermission="draw-management-view"><DrawsOverview /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Draw Management" requiredPermission="draw-management-view"><ViewDraw /></PermissionProtectedRoute>} />
                </Route>

                {/* Prize Claims */}
                <Route path="prize-claims">
                  <Route index element={<PermissionProtectedRoute requiredModule="Prize Management" requiredPermission="prize-management-view"><PrizeClaims /></PermissionProtectedRoute>} />
                  <Route path=":id" element={<PermissionProtectedRoute requiredModule="Prize Management" requiredPermission="prize-management-view"><ProcessClaim /></PermissionProtectedRoute>} />
                </Route>

                {/* Prize Management */}
                <Route path="prizes">
                  <Route index element={<PermissionProtectedRoute requiredModule="Prize Management" requiredPermission="prize-management-view"><PrizeManagement /></PermissionProtectedRoute>} />
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
