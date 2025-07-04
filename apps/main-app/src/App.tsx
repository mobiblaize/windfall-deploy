import {
	BrowserRouter,
	Navigate,
	Route,
	Routes,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Draws from "./pages/draws/Draws";
import MainLayout from "./pages/Main";
import SpecificResult from "./pages/draws/SpecificResult";
import AllWinnersPage from "./pages/winners/AllWinnersPage";
import AllPricesPage from "./pages/prizes/AllPricesPage";
import RecentDraws from "./pages/draws/RecentDraws";
import LoginPage from "./pages/login/LoginPage";
import ResetPassword from "./pages/login/ResetPassword";
import Signup from "./pages/checkout/Signup";
import Cart from "./pages/checkout/Cart";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />

					<Route path="login" element={<LoginPage/>} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="raffles" element={<Draws />} />
					<Route path="draws" element={<RecentDraws/>} />
					<Route path="winners/:id" element={<SpecificResult />} />
					<Route path="winners/all-time" element={<AllWinnersPage />} />
					<Route path="prize" element={<AllPricesPage />} />
					<Route path="reset-password" element={<ResetPassword />} />
					<Route path="checkout" element={<Cart/>} />
					<Route path="checkout/signup" element={<Signup />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
