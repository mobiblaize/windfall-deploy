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
import RaffleGames from "./pages/RaffleGames";
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
					<Route path="draws" element={<Draws />} />
					<Route path="draws/:id" element={<SpecificResult />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
