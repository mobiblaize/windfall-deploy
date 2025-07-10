import { Container, Text } from "@mantine/core";
import CheckoutLists from "./CheckoutLists";


function CheckoutPage() {
	// const isUser = false;

	// const navigate = useNavigate();
	// if (!isUser) navigate("signup");
	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="lg" className="!mx-3 sm:!mx-auto">
				<Text className="!text-2xl !font-semibold">
					Checkout <span className="text-primary-red">(07)</span>
				</Text>
				<Text className="!text-secondary-text">
					Buy Raffle ticket in very simple step and stand a chance to win big!!!
				</Text>

				<CheckoutLists />
			</Container>
		</div>
	);
}

export default CheckoutPage;
