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


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />

					<Route path="login" element={<LoginPage/>} />
					<Route path="dashboard" element={<Dashboard />} />
					<Route path="raffles" element={<Draws />} />
					<Route path="raffles/:id" element={<SpecificResult />} />
					<Route path="draws" element={<RecentDraws/>} />
					<Route path="winners/all-time" element={<AllWinnersPage />} />
					<Route path="prize" element={<AllPricesPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
