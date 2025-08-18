/* eslint-disable no-irregular-whitespace */
import {
	Button,
	Container,
	Divider,
	Flex,
	Image,
	Indicator,
	List,
	Text,
} from "@mantine/core";
import HelpSection from "../../components/HelpSection";
import { useNavigate } from "react-router-dom";

function SpecificResult() {
  const navigate = useNavigate();

	return (
		<div className="mb-10 flex flex-col h-full  md:mx-10 lg:mx-14 mt-10">
			<section className="text-primary-text p-4">
				<Text className="!font-bold !text-xl sm:!text-2xl md:!text-3xl lg:!text-4xl ">
					I Never Thought ₦5K Could Change My Life" — Meet the Winner of a
					One-Bedroom Flat in Akoka-Yaba, Lagos
				</Text>
				<div className=" overflow-hidden grid sm:grid-flow-col md:grid-rows-2 gap-3 md:gap-5 my-10 sm:h-[200px] md:h-[300px] lg:h-[400px]">
					<div className="row-span-2 rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result1.png"
							alt="Draw Result 1"
							className="w-full h-full"
						/>
					</div>
					<div className=" rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result2.png"
							alt="Draw Result 2"
							className="w-full h-full"
						/>
					</div>
					<div className=" rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result3.png"
							alt="Draw Result 1"
							className="w-full h-full "
						/>
					</div>
					<div className="row-span-2 rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result4.png"
							alt="Draw Result 2"
							className="w-full h-full"
						/>
					</div>
				</div>

				<div className="my-5 ">
					{" "}
					<Divider variant="dashed" color="var(--color-primary-red)" />
					<Flex
						mih={50}
						bg="var(--color-secondary-red)"
						gap="md"
						justify="space-around"
						align="center"
						direction="row"
						wrap="nowrap"
					>
						<div className="flex gap-x-2 items-center ">
							<span className="bg-primary-red/30 p-2">
								<Indicator color="var(--color-primary-red)" className="z-0" />
							</span>
							<p>
								<span className="text-secondary-text">Location:</span>{" "}
								Akoka-yaba
							</p>
						</div>
						<Divider
							orientation="vertical"
							my="xs"
							color="var(--color-primary-red)"
						/>

						<div className="flex gap-x-2 items-center">
							<span className="bg-primary-red/30 p-2">
								<Indicator color="var(--color-primary-red)" className="z-0" />
							</span>
							<p>
								<span className="text-secondary-text">Location:</span>{" "}
								Akoka-yaba
							</p>
						</div>
						<Divider
							orientation="vertical"
							my="xs"
							color="var(--color-primary-red)"
						/>

						<div className="flex gap-x-2 items-center">
							<span className="bg-primary-red/30 p-2">
								<Indicator color="var(--color-primary-red)" className="z-0" />
							</span>
							<p>
								<span className="text-secondary-text">Location:</span>{" "}
								Akoka-yaba
							</p>
						</div>
					</Flex>
					<Divider variant="dashed" color="var(--color-primary-red)" />
				</div>
				<Container size="xs" className="my-7 md:my-10 lg:my-14">
					<Text>
						Buying a house in Lagos? That’s a dream many Nigerians shelve due to
						rising costs and inaccessible housing schemes. But for Oluwaseun
						Adeyemi, a 31-year-old administrative officer living in Bariga, a
						₦5,000 raffle ticket became her unexpected key to a brand-new life.
					</Text>
					<Text mt="md" className="text-secondary-text" fs="italic" size="sm">
						“Honestly, I just wanted to try. I’d seen posts online and thought,
						‘What’s the worst that could happen?’” she shared, laughing”
					</Text>
					<Text mt="md">
						The Windfall team had hosted a live draw, open and transparent,
						streamed on all their social platforms. The winner was picked
						randomly using a digital system, and Oluwaseun’s ticket ID stood
						out.
					</Text>
				</Container>
				<Container size="xl" className=" grid sm:grid-cols-2 gap-5 md:gap-7 ">
					<div className=" rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result3.png"
							alt="Draw Result 3"
							className="h-full"
						/>
					</div>
					<div className=" rounded-lg overflow-hidden">
						<Image
							src="/src/assets/draw-result2.png"
							alt="Draw Result 2"
							className="h-full"
						/>
					</div>
				</Container>
				<Container size="xs" className="my-7 md:my-10 lg:my-14">
					<Text
						className="!text-primary-red !font-semibold !text-lg lg:!text-xl"
						my="md"
					>
						🏘️ The Apartment? More Than Just a Room
					</Text>
					<List type="ordered" withPadding size="lg">
						<List.Item>Spacious bedroom and living area</List.Item>
						<List.Item>
							Fully tiled with premium kitchen and bathroom fixtures
						</List.Item>
						<List.Item>Water and electricity already connected</List.Item>
						<List.Item>Title documents clean and fully processed</List.Item>
					</List>
					<Text my="md" size="lg">
						This was not a “promo flat” — it was the real deal.
					</Text>
					<Text fs="italic" size="md" className="text-secondary-text">
						“I’ve rented all my life. Owning a space, especially in this part of
						Lagos, never seemed realistic. But here I am.”
					</Text>
					<Divider my="md" />
				</Container>
				<Container size="xl" className=" ">
					<div className=" rounded-lg overflow-hidden h-[200px] sm:h-[300px] md:h-[400px]">
						<Image
							src="/src/assets/draw-result1.png"
							alt="Draw Result 1"
							className="w-full h-full object-cover"
						/>
					</div>
				</Container>
				<Container size="xs" className="my-7 md:my-10 lg:my-14">
					<Text
						className="!text-primary-red !font-semibold !text-lg lg:!text-xl"
						my="md"
					>
						💡 The Impact? Beyond a House
					</Text>
					<Text my="md" size="lg">
						For Oluwaseun, this isn’t just about a roof over her head — it’s
						proof that ordinary people can get extraordinary breaks.
					</Text>
					<Text my="md" size="md" fs="italic" className="!text-secondary-text">
						“To anyone reading this: don’t sleep on Windfall. If I can win, so
						can you.”
					</Text>
					<Text my="md" size="lg">
						She plans to move in soon, turn the space into her peaceful escape
						from the chaos of Lagos, and maybe even help her younger sister with
						accommodation.
					</Text>
					<Divider my="xl" />

					<Text
						className="!text-primary-red !font-semibold !text-lg lg:!text-xl"
						my="md"
					>
						🎉 Why Windfall Raffle Is Gaining Trust
					</Text>
					<Text my="md" size="lg">
						This story is one of many. Windfall Raffle is steadily building a
						community of everyday Nigerians whose lives are being transformed —
						one draw at a time.
					</Text>
					<Text my="md" size="lg">
						If you’re reading this and you’ve ever wondered if raffles like this
						are real, Oluwaseun’s story says it all. Yes, real people are
						winning real homes.
					</Text>
					<Divider my="xl" />
					<Button className="!capitalize !bg-primary-text ">
						{" "}
						watch video interview
					</Button>
				</Container>
				<Container
					className="!bg-[#030303] !py-3 rounded-xl !mb-7 md:!mb-14 relative h-fit"
					size="xl"
				>
					<HelpSection
					  heading={
						<>
						  How to Claim Your Prize
						</>
					  }
					  description="Follow these simple steps to verify and receive your winnings."
					  buttonText="Let’s Talk"
					  onClick={() => navigate("/contact-us")}
					/>
				</Container>
			</section>
		</div>
	);
}

export default SpecificResult;
