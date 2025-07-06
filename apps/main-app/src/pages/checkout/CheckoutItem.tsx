import { Flex, Text } from "@mantine/core";

function CheckoutItem({item}:{item:any}) {
	return (
		<div className=" border-2 border-dashed border-secondary-text rounded-xl py-5 px-5">
			<Text fz="lg" fw={600}>
				Secure a Luxury Studio Apartment in Lekki, Lagos State, Nigeria
			</Text>
			<Text className="!text-secondary-text">
				Enter now to grab the opportunity of a brand new Ho...
			</Text>
			<Flex justify="space-around" my="md">
				<div className="text-center capitalize">
					<Text fw={100} className="!text-secondary-text">
						QTY
					</Text>
					<Text fw={500}>25 units</Text>
				</div>
				<div className="text-center capitalize">
					<Text fw={100} className="!text-secondary-text">
						unit price
					</Text>
					<Text fw={500}>25 units</Text>
				</div>
				<div className="text-center capitalize">
					<Text fw={100} className="!text-secondary-text">
						total price
					</Text>
					<Text fw={500}>25 units</Text>
				</div>
			</Flex>
		</div>
	);
}

export default CheckoutItem;
