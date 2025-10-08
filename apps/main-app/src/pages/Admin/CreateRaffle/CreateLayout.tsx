import {
	Button,
	Card,
	Container,
	Flex,
	Group,
	Stepper,
	Text,
	Box,
	Divider,
} from "@mantine/core";
import { useState } from "react";
import { FaAngleLeft, FaCheck } from "react-icons/fa";
import BasicInformation from "./BasicInformation";
import Layout from "./Layout";
import TicketPrice from "./TicketPrice";
import ContentMarketing from "./ContentMarketing";
import MediaContent from "./MediaContent";
import { IoAdd } from "react-icons/io5";
import DynamicBreadcrumbs, {
	type Crumb,
} from "../../../components/DynamicBreadCrumbs";
const breadCrumbs: Crumb[] = [
	{ label: "Raffle Management", to: "/admin/raffles" },
	{ label: "create a new raffle", to: "/create-raffle" },
];
function CreateLayout() {
	const [active, setActive] = useState(0);
	const nextStep = () =>
		setActive((current) => (current < 3 ? current + 1 : current));
	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	// const handleNext = () => {};
	const stepsLayout = [
		{
			label: "basic information",
			description: "enter raffle basic detail below",
			component: <BasicInformation />,
		},
		{
			label: "ticket price & discount",
			description: "set ticket price and discount",
			component: <TicketPrice />,
		},
		{
			label: "content marketing",
			description:
				"Enter other content that influences the decision of customer for this raffle",
			component: <ContentMarketing />,
		},
		{
			label: "media content",
			description: "Set game banner, featured images etc.",
			component: <MediaContent />,
		},
	];
	return (
		<>
			<DynamicBreadcrumbs items={breadCrumbs} />

			<Divider />

			<Flex justify={"space-between"} align={"center"} px={"lg"} my="sm" className="!bg-white">
				<Box>
					<Text tt={"capitalize"} fz={"lg"} fw={"600"} c="var(--primary-text)">
						create a raffle
					</Text>
					<Text tt={"capitalize"} fz={"sm"} className="!text-secondary-text">
						create new raffle game in simple step
					</Text>
				</Box>
				<Button rightSection={<IoAdd className="bg-secondary-red/30 " />}>
					create a new raffle
				</Button>
			</Flex>
			<Divider my="sm" />
			<Container
				className="text-primary-text !mx-auto w-full md:w-2/3 lg:w-[70%]"
				mt="lg"
				// size="xl"
			>
				<Stepper
					allowNextStepsSelect={false}
					active={active}
					onStepClick={setActive}
					className="capitalize"
					size="xs"
					icon={<FaCheck className="text-secondary-red" />}
					styles={{
						stepBody: {
							display: "none",
						},
						step: {
							padding: 0,
						},
						stepIcon: {
							color: "white",
						},
						separator: {
							marginLeft: -2,
							marginRight: -2,
							height: 4,
						},
					}}
				>
					{stepsLayout.map((step) => (
						<Stepper.Step
							key={step.label}
							label={step.label}
							allowStepClick={false}
						/>
					))}
				</Stepper>
				<Card withBorder mt={"xl"} radius={"md"}>
					{stepsLayout.map((step, index) => (
						<Layout
							key={step.label}
							description={step.description}
							label={step.label}
							className={`${active === index ? "block" : "!hidden"}`}
						>
							{step.component}
						</Layout>
					))}

					<Group justify="end" mt="xl">
						{active === 0 || (
							<Button
								variant="default"
								onClick={prevStep}
								leftSection={<FaAngleLeft />}
							>
								Back
							</Button>
						)}
						<Button onClick={nextStep}>continue</Button>
					</Group>
				</Card>
			</Container>
		</>
	);
}

export default CreateLayout;
