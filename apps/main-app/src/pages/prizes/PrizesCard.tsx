import { Card, Image, Text } from "@mantine/core";

function PrizesCard({item}:{item:any}) {
	return (
		<Card>
			<Card.Section className="!m-3">
				<Image
					className="!rounded-xl h-[200px]"
					src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
					alt="Norway"
				/>
			</Card.Section>
			<Card.Section className="!mx-3 !my-4">
				<Text className="!capitalize">a luxury house in lekki</Text>
				<Text fz="lg" className="!text-primary-red">
					Price category:{" "}
					<span className="text-secondary-text font-medium text-sm">
						Grand price
					</span>
				</Text>
				<Text className="!font-light !my-4 !tracking-wide">
					Win a stunning, fully finished luxury home in the prestigious
					neighbourhood of Lekki, Lagos. This exquisite property features
					premium fittings, elegant design, ample space, and top-notch
					finishing. Nestled in a serene, secure environment with easy access to
					key landmarks, it’s more than just a home — it’s a lifestyle upgrade.
					All it takes is one raffle ticket to make this dream your reality.
				</Text>
			</Card.Section>
		</Card>
	);
}

export default PrizesCard;
