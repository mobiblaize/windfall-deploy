import { Container, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import CartItem from "./CartItem";
import EmptyCart from "./EmptyCart";

function Cart() {
	const cart = [
		"item1",
		"item2",
		"item3",
		"item4",
		"item5",
		"item6",
		"item7",
	];
	const navigate = useNavigate();

	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="lg" className="!mx-5 sm:!mx-auto !px-3 xl:!px-0">
				<Text className="!text-2xl !font-semibold !capitalize">
					my game cart <span className="text-primary-red">(07)</span>
				</Text>
				<Text className="!text-secondary-text">
					See the list of Raffle Ticket you want buy. Checkout now before draw
				</Text>

				{cart.length === 0 ? (
					<EmptyCart />
				) : (
					cart.map((item) => <CartItem key={item} item={item} />)
				)}

				{cart.length && <div className="bg-white rounded-xl border border-[#e5e7eb] px-6 py-6 mt-10 shadow-sm">
					<div className="flex flex-col justify-between gap-6">
						<div className="space-y-3 text-gray-800 text-sm">
							<div className="flex justify-between items-center gap-6">
								<p><span className="font-medium">Total Number of Ticket:</span></p>
								<p><span className="font-bold">20 Ticket</span></p>
							</div>
							<div className="flex justify-between items-center gap-6">
								<p><span className="font-medium">Total Prices of Ticket:</span></p>
								<p><span className="font-bold text-lg">₦ 500</span></p>
							</div>
						</div>

						<div className="flex justify-end items-center gap-6">
							<button
								onClick={() => navigate("/checkout")}
								className="bg-primary-red text-white font-semibold text-sm px-6 py-3 rounded-md border-[2px] border-dashed border-[#fff] hover:bg-primary-red transition"
							>
								Checkout ~ ₦500
							</button>
						</div>
					</div>
				</div>}				
			</Container>
		</div>
	);
}

export default Cart;
