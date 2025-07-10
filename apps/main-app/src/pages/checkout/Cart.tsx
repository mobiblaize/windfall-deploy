import { Container, Text } from "@mantine/core";

import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";

function Cart() {
	const cart = [];
	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="lg" className="!mx-5 sm:!mx-auto !px-3 xl:!px-0">
				<Text className="!text-2xl !font-semibold !capitalize">
					my game cart <span className="text-primary-red">(07)</span>
				</Text>
				<Text className="!text-secondary-text">
					See the list of Raffle Ticket you want buy. Checkout now before draw
				</Text>
				{cart.length === 0 ?
					<EmptyCart />
				:	cart.map((item) => {
						return <CartItem key={item} item={item} />;
					})
				}
			</Container>
		</div>
	);
}

export default Cart;
