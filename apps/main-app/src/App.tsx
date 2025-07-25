import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Draws from "./pages/draws/Draws";
import MainLayout from "./pages/Main";
import SpecificResult from "./pages/draws/SpecificResult";
import RaffleGames from "./pages/raffles/RaffleGames";
import AllWinnersPage from "./pages/winners/AllWinnersPage";
import AllPricesPage from "./pages/prizes/AllPricesPage";
import RecentDraws from "./pages/draws/RecentDraws";
import LoginPage from "./pages/login/LoginPage";
import ResetPassword from "./pages/login/ResetPassword";
import Signup from "./pages/checkout/Signup";
import Cart from "./pages/checkout/Cart";
import CheckoutPage from "./pages/checkout/CheckoutPage";

import RaffleGroups from "./pages/raffles/RaffleGroups";
import RafflesPaymentReceipt from "./pages/raffles/RafflesPaymentReceipt";
import ProfileLayout from "./pages/Profile/ProfileLayout";
import GamesTickets from "./pages/Profile/GamesTickets";
import ResultsLayout from "./pages/Profile/ResultsLayout";
import GameResultsTickets from "./pages/Profile/GameResultsTickets";
import RecentWinners from "./pages/winners/RecentWinners";
import TransactionsLayout from "./pages/Profile/TransactionsLayout";
import TransactionReceipt from "./pages/Profile/TransactionReceipt";
import RaffleDetails from "./pages/raffles/RaffleDetails";
import ResponsiblePlaying from "./pages/ResponsiblePlaying";
import ContactUs from "./pages/ContactUs";
import GameRules from "./pages/GameRules";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/AboutUs";
import TermsOfUse from "./pages/TermsOfUse";
import Faq from "./pages/Faq";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DownloadApp from "./pages/DownloadApp";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<Navigate to="/dashboard" replace />} />

					<Route path="login" element={<LoginPage />} />
					
					<Route path="signup" element={<Signup />} />

					<Route path="dashboard" element={<Dashboard />} />
					<Route path="reset-password" element={<ResetPassword />} />
					
					<Route path="draws" element={<Draws />} />
					<Route path="draws" element={<RecentDraws/>} />

					<Route path="winners/all-time" element={<AllWinnersPage />} />
					<Route path="winners/recent" element={<RecentWinners/>} />
					<Route path="winners/all-time/:id" element={<SpecificResult />} />
					
					<Route path="prize" element={<AllPricesPage />} />
					<Route path="cart" element={<Cart />} />

					<Route path="responsible-playing" element={<ResponsiblePlaying />} />

					<Route path="game-rules" element={<GameRules />} />

					<Route path="terms-and-conditions" element={<TermsAndConditions />} />

					<Route path="faq" element={<Faq />} />

					<Route path="privacy-policy" element={<PrivacyPolicy />} />

					<Route path="about" element={<AboutUs />} />

					<Route path="terms-of-use" element={<TermsOfUse />} />
					
					<Route path="contact-us" element={<ContactUs />} />

					<Route path="checkout" element={<CheckoutPage />} />

					<Route path="download-app" element={<DownloadApp />} />

					<Route path="checkout/signup" element={<Signup />} />

					<Route path="raffles" element={<RaffleGames />} />
					<Route path="raffles/:id" element={<RaffleDetails />} />
					<Route path="raffles/receipts" element={<RafflesPaymentReceipt />} />
					<Route path="raffles/receipts/:id" element={<RaffleGroups />} />

					<Route
						path="profile"
						element={<Navigate to="/profile/all-games" replace />}
					/>
					<Route path="profile/all-games" element={<ProfileLayout />} />
					<Route path="profile/all-games/:id" element={<GamesTickets />} />
					<Route path="profile/result" element={<ResultsLayout />} />
					<Route path="profile/result/:id" element={<GameResultsTickets/>} />
					<Route path="profile/transaction" element={<TransactionsLayout/>} />
					<Route path="profile/transaction/receipt" element={<TransactionReceipt/>} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
