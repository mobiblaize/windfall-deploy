import { Modal, Button, Center, Image, Text, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import loadingGif from "../../assets/loading.gif";
type Props = {
    title:string
    desc:string
    btnLabel:string
}

function ProcessingModal({title,desc}:Props) {
const [opened, { open, close }] = useDisclosure(false);
    return (
			<>
				<Modal
					opened={opened}
					onClose={close}
					withCloseButton={false}
					centered
					size="md"
					className="!rounded-2xl !text-primary-text"
					classNames={{ content: "!rounded-3xl" }}
				>
					<Center className="!grid !text-center">
						<Image
							// fit="contain"
							src={loadingGif}
							className="!mx-auto"
							h={200}
							w={100}
						/>

						<Stack>
							{" "}
							<Text className="!text-2xl !font-semibold !tracking-wide">
								{/* New Password Created */}
								{title}
							</Text>
							<Text className="!text-lg !text-secondary-text !tracking-wide">
								{/* Congratulations, you have successfully created a new password for
                            your WindFall raffle Account. Now start playing */}
								{desc}
							</Text>
						</Stack>
					</Center>
				</Modal>

				<Button
					// disabled
					onClick={open}
					className=" !tracking-wide !border !border-dashed !border-secondary-red disabled:!bg-primary-red/40  !text-white"
				>
					Create password
				</Button>
			</>
		);
}

export default ProcessingModal