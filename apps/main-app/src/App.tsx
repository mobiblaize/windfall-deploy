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


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />

					<Route path="dashboard" element={<Dashboard />} />
					<Route path="raffles" element={<RaffleGames />} />
					<Route path="draws" element={<Draws />} />
					<Route path="draws/:id" element={<SpecificResult />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
