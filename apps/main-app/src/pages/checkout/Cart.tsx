import { Card, Container, Image, Text } from "@mantine/core";

import { HiMiniTrash } from "react-icons/hi2";
import { PiPlusFill } from "react-icons/pi";
import { PiMinusFill } from "react-icons/pi";

function Cart() {
	return (
		<div className="text-primary-text mt-16 mb-32 ">
			<Container size="lg"  className="!mx-5 sm:!mx-auto !px-3 xl:!px-0">
				<Text className="!text-2xl !font-semibold">
					Checkout <span className="text-primary-red">(07)</span>
				</Text>
				<Text className="!text-secondary-text">
					Buy Raffle ticket in very simple step and stand a chance to win big!!!
				</Text>
				<Card className="!border !border-dashed !border-primary-red !rounded-lg !my-10 !bg-white/80">
					<div className="grid grid-flow-row md:grid-cols-2 gap-x-10 items-center ">
						<div className="flex items-center gap-x-3">
							<div className="rounded-2xl overflow-hidden border-2 border-primary-red h-24 w-32 ">
								<Image
									src="/src/assets/cart-temp-image.jpg"
									className="h-full"
								/>
							</div>
							<div>
								<Text className=" md:!text-xl !font-semibold">
									Secure a Luxury Studio Apartment in Lekki, Lagos State,
									Nigeria
								</Text>
								<Text className="!text-secondary-text">
									Enter now to grab the opportunity of a brand new Ho...
								</Text>
							</div>
						</div>
						<div className="flex justify-around items-center">
							<div className="flex gap-x-2 md:gap-x-5 items-center">
								<PiPlusFill
									size={32}
									className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
								/>

								<Text className="!px-4 !py-1 !rounded-t-lg !font-semibold !text-primary-red  md:!text-xl !bg-secondary-red !border-b-2 !border-primary-red">
									20
								</Text>

								<PiMinusFill
									size={32}
									className="p-2 text-[#ABABAB] rounded-full bg-white cursor-pointer shadow-md"
								/>
							</div>
							<div className="text-center tracking-wide">
								<Text className="!text-secondary-text !text-sm md:!text-base">
									Unit price
								</Text>
								<Text className="!font-semibold md:!text-xl ">#80,000</Text>
							</div>
							<div className="text-center tracking-wide">
								<Text className="!text-secondary-text !text-sm md:!text-base">
									Total price
								</Text>
								<Text className="!font-semibold md:!text-xl ">#80,000</Text>
								<Text className="!line-through !text-primary-red !font-light md:!text-lg">
									#92,000
								</Text>
							</div>

							<HiMiniTrash
								// size={32}
								className="text-primary-red rounded-full bg-[#FFD5D6] p-1 md:p-2 cursor-pointer text-3xl md:text-4xl"
							/>
						</div>
					</div>
				</Card>
			</Container>
		</div>
	);
}

export default Cart;
