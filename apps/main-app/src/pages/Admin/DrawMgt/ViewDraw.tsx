import {
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Box,
  SimpleGrid,
  Checkbox,
  Button,
  Divider,
  Avatar,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import ConfettiImage from "../../../assets/confetti.png";
import { useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePostData } from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import { IconBell } from "@tabler/icons-react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { BiSolidBell } from "react-icons/bi";
import CustomTickets from "../../../components/CustomTickets";
import { FaMagic } from "react-icons/fa";
import UnlockDrawModal from "./UnlockDrawModal";
import RenderSkeletonText from "../../../components/RenderSkeletonText";
import LoadingState from "../../../components/LoadingState";

const breadCrumbs: Crumb[] = [
  { label: "Draw Management", to: "/admin/draws" },
  { label: "View Draw" },
];

type Winner = {
  uuid: string;
  customer_name: string;
  customer_email: string;
  customer_phone_number: string;
  customer_image: string | null;
  ticket_number: string;
  prize_name: string;
  won_at: string;
};

export interface DrawLineResponse {
  draw_line: DrawLine;
  approval_flow: ApprovalFlow;
}

export interface DrawLine {
  uuid: string;
  status: "open" | "closed" | "cancelled";
  approvalStatus: string;
  draw_at: string | null;
  created_at: string;
  draw: Draw;
  qualified_tickets_count: number;
  unique_customers_count: number;
  potential_winners: number;
  winner?: Winner;
}

export interface Draw {
  uuid: string;
  draw_number: string;
  draw_date: string;
  status: string;
  game: Game;
}

export interface Game {
  uuid: string;
  name: string;
}

export interface ApprovalFlow {
  approval_request: ApprovalRequest;
  approval_processes: ApprovalProcess[];
  is_auth_user_in_approvers: boolean;
  approver: Approver;
}

export interface ApprovalRequest {
  id: string;
  module_id: string;
  admin_id: string;
  name: string;
  image: string;
  model_id: string;
  reason: string;
  workflow_type: string;
}

export interface ApprovalProcess {
  process_id: string;
  approval_request_id: string;
  admin_id: string;
  name: string;
  avatar: string;
  level: number;
  comment: string;
  reason: string;
  level_name: string;
  status: string;
  is_auth_user_approver: boolean;
  can_approve: string;
}

export interface Approver {
  process_id: string;
  approval_request_id: string;
  admin_id: string;
  name: string;
  avatar: string;
  level: number;
  comment: string;
  reason: string;
  level_name: string;
  status: string;
  is_auth_user_approver: boolean;
  can_approve: string;
}

type StatsCard = {
  title: string;
  value: number;
  className: string;
  color: string;
};

export default function ViewDraw() {
  const { id } = useParams<{ id: string }>();
  const [drawLineData, setDrawLineData] = useState<DrawLineResponse | null>(
    null
  );
  const [winner, setWinner] = useState<Winner | null>(null);
  const [otpMessage, setOtpMessage] = useState<string>(
    "Enter the OTP sent to your email to unlock this draw."
  );
  const [unlockDrawModalOpen, setUnlockDrawModalOpen] = useState(false);
  const [unlockSuccessModalOpen, setUnlockSuccessModalOpen] = useState(false);
  const [videoAlertModalOpen, setVideoAlertModalOpen] = useState(false);
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [winnerSuccessModalOpen, setWinnerSuccessModalOpen] = useState(false);
  const [selectWinnerErrorModalOpen, setSelectWinnerErrorModalOpen] =
    useState(false);
  const [selectWinnerErrorMessage, setSelectWinnerErrorMessage] =
    useState<string>("");
  const [isWon, setIsWon] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(300);

  // Fetch draw line data
  const {
    data: drawLineResponse,
    isLoading: isDrawLineLoading,
    isError: isDrawLineError,
    error: drawLineError,
  } = useFetchData(id ? `admin/draw-management/single-draw-line/${id}` : null);

  // API mutations
  const initiateOtpMutation = usePostData("");
  const verifyOtpMutation = usePostData("");
  const selectWinnerMutation = usePostData("");

  async function unlockDraw() {
    if (!drawLineData?.approval_flow.approver?.process_id) return;

    try {
      const response = await initiateOtpMutation.mutateAsync({
        url: `admin/draw-management/initiate-draw-otp/${drawLineData.approval_flow.approver?.process_id}`,
        payload: {},
      });

      if (response.message) {
        setOtpMessage(response.message);
      }
      setTimeLeft(300);
      setUnlockDrawModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "Failed to Initiate OTP",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }

  async function submitUnlockPin(pin: string) {
    if (!drawLineData?.approval_flow.approver?.process_id) return;

    try {
      await verifyOtpMutation.mutateAsync({
        url: `admin/draw-management/verify-draw-otp/${drawLineData.approval_flow.approver?.process_id}`,
        payload: { otp: pin },
      });

      setUnlockDrawModalOpen(false);
      setUnlockSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "OTP Verification Failed",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }

  async function resendOtp() {
    if (!drawLineData?.approval_flow.approver?.process_id) return;

    try {
      const response = await initiateOtpMutation.mutateAsync({
        url: `admin/draw-management/initiate-draw-otp/${drawLineData.approval_flow.approver?.process_id}`,
        payload: {},
      });

      if (response.message) {
        setOtpMessage(response.message);
      }
      setTimeLeft(300);
    } catch (error) {
      notifications.show({
        title: "Failed to Resend OTP",
        message:
          (error as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
  }

  function showDraw() {
    setUnlockSuccessModalOpen(false);
    setVideoAlertModalOpen(true);
  }

  function handleVideoModalClose() {
    setVideoAlertModalOpen(false);
    setStep(2);
  }

  async function startDraw() {
    if (!id) return;

    setDrawModalOpen(true);

    try {
      const response = await selectWinnerMutation.mutateAsync({
        url: `admin/draw-management/select-winner/${id}`,
        payload: {},
      });

      if (response.data?.winner) {
        setWinner(response.data.winner);
        setIsWon(true);
      }
      setDrawModalOpen(false);
      setWinnerSuccessModalOpen(true);
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || "An error occurred";

      notifications.show({
        title: "Failed to Select Winner",
        message: errorMessage,
        color: "red",
      });

      setSelectWinnerErrorMessage(errorMessage);
      setDrawModalOpen(false);
      setSelectWinnerErrorModalOpen(true);
    }
  }

  // Handle draw line data fetch
  useEffect(() => {
    if (isDrawLineError) {
      notifications.show({
        title: "Failed to fetch Draw Line",
        message:
          (drawLineError as { message?: string })?.message ||
          "An error occurred",
        color: "red",
      });
    }
    if (drawLineResponse?.data) {
      const drawLine = drawLineResponse.data?.draw_line as DrawLine;
      setDrawLineData(drawLineResponse?.data);

      // Determine initial step and winner state
      if (drawLine.approvalStatus?.toLowerCase() === "approved")
        setStep(2);
      if (drawLine.winner && drawLine.winner.won_at) {
        setStep(2);
        setIsWon(true);
        setWinner(drawLine.winner);
      } else {
        setStep(1);
        setIsWon(false);
      }
    }
  }, [drawLineError, isDrawLineError, drawLineResponse]);

  const form = useForm({
    initialValues: {
      ageConfirmed: false,
    },
  });

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-10 pt-7 pb-2">
          <Flex mb="lg" justify="space-between">
            <div>
              {isDrawLineLoading ? (
                <RenderSkeletonText height={35} width="100%" />
              ) : (
                <>
                  <Title className="!text-primary-text text-2xl" order={2}>
                    {drawLineData?.draw_line.draw.game.name || "View Draw"}
                  </Title>
                </>
              )}
              <Text className="!text-secondary-text">
                {isWon ? "View" : "Start"} Draw for this game.
              </Text>
            </div>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        {isDrawLineLoading ? (
          <LoadingState
            title="Loading Draw Line"
            description="Fetching draw line data, please wait..."
          />
        ) : (
          <>
            {step === 1 && (
              <>
                <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
                  <div className="bg-[#D9D9D9] h-25 w-25 rounded-full mb-10"></div>
                  <Flex
                    align={"self-start"}
                    gap="md"
                    className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                  >
                    <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-lg border border-[#FFD5D6]">
                      <IconBell className="!text-xl !text-primary-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Confirm Game Details Before Starting
                      </h3>
                      <p className="text-base text-secondary-text">
                        Review the raffle title, ticket price, draw date, and
                        all related configurations to ensure they are correct.
                        Once the draw starts, these details can't be edited.
                      </p>
                    </div>
                  </Flex>
                  <Flex
                    align={"self-start"}
                    gap="md"
                    className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                  >
                    <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-lg border border-[#FFD5D6]">
                      <IconBell className="!text-xl !text-primary-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Ensure Ticket Sales Are Closed
                      </h3>
                      <p className="text-base text-secondary-text">
                        Make sure ticket sales have officially ended before
                        starting the draw. Starting a draw while sales are still
                        active can affect fairness and system accuracy.
                      </p>
                    </div>
                  </Flex>
                  <Flex
                    align={"self-start"}
                    gap="md"
                    className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                  >
                    <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-lg border border-[#FFD5D6]">
                      <IconBell className="!text-xl !text-primary-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Verify Prize Setup and Availability
                      </h3>
                      <p className="text-base text-secondary-text">
                        Confirm that all listed prizes for this draw are
                        properly set up, available, and verified by the finance
                        or prize management team.
                      </p>
                    </div>
                  </Flex>
                  <Flex
                    align={"self-start"}
                    gap="md"
                    className="border-b border-[#C0C0C5] !pb-6 !mb-6"
                  >
                    <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-lg border border-[#FFD5D6]">
                      <IconBell className="!text-xl !text-primary-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Ensure Supervisory Presence
                      </h3>
                      <p className="text-base text-secondary-text">
                        The draw process should only begin when an authorized
                        personnel or auditor is present to monitor transparency
                        and compliance.
                      </p>
                    </div>
                  </Flex>

                  <Checkbox
                    label={
                      <div>
                        <p className="text-base text-primary-text">
                          I have read the instructions.
                        </p>
                        <p className="text-base text-secondary-text">
                          You agree to have read and understand the instruction
                          above for the draw process.
                        </p>
                      </div>
                    }
                    {...form.getInputProps("ageConfirmed", {
                      type: "checkbox",
                    })}
                  />
                </Card>

                <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !py-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
                  <Flex justify="flex-end" gap={20}>
                    <Button
                      size="lg"
                      fullWidth={false}
                      variant="default"
                      leftSection={<BsChevronLeft />}
                    >
                      Back
                    </Button>
                    <CustomButton
                      size="lg"
                      border={false}
                      fullWidth={false}
                      variant="default"
                      rightSection={<BsChevronRight />}
                      loading={
                        initiateOtpMutation.isPending ||
                        verifyOtpMutation.isPending
                      }
                      onClick={unlockDraw}
                      disabled={
                        !form.values.ageConfirmed ||
                        initiateOtpMutation.isPending ||
                        verifyOtpMutation.isPending
                      }
                    >
                      Unlock Draw
                    </CustomButton>
                  </Flex>
                </Card>
              </>
            )}

            {step === 2 && (
              <>
                <div className="text-primary-text px-6 md:px-10 pb-10 pt-10">
                  <div className="relative">
                    {isWon && (
                      <>
                        {/* top confetti strip */}
                        <div
                          className="absolute left-10 right-10 top-0 h-12 pointer-events-none z-10"
                          style={{
                            backgroundImage: `url(${ConfettiImage})`,
                            backgroundSize: "auto 100%",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "top",
                          }}
                          aria-hidden="true"
                        />

                        {/* bottom confetti strip */}
                        <div
                          className="absolute left-10 right-10 bottom-0 h-12 pointer-events-none z-10"
                          style={{
                            backgroundImage: `url(${ConfettiImage})`,
                            backgroundSize: "auto 100%",
                            backgroundRepeat: "repeat-x",
                            backgroundPosition: "bottom",
                            transform: "rotate(180deg)",
                          }}
                          aria-hidden="true"
                        />
                      </>
                    )}
                    <CustomTickets
                      borderColor="!border-primary-red"
                      bgColor={isWon ? "!bg-secondary-red" : "!bg-white"}
                    >
                      <Grid gutter="sm" justify="center">
                        <Grid.Col span={{ base: 12, md: 6 }}>
                          <div className="relative p-0 sm:px-6 py-6">
                          <Text className="!text-xl !text-center md:!text-2xl !font-semibold !text-gray-900 !mb-6">
                            Winning Raffle Number
                          </Text>

                          <Box className="border-2 relative border-dashed border-primary-red text-center px-6 py-4 rounded-lg !bg-white !mb-5">
                            <Text className="!text-sm !text-gray-600 !mb-1">
                              Ticket Number
                            </Text>
                            <Text className="!text-primary-red sm:!text-3xl !text-2xl !font-bold !tracking-wide break-all">
                              {isWon && winner
                                ? winner.ticket_number
                                : "**********"}
                            </Text>
                          </Box>

                          {isWon && winner ? (
                            <Group className="mt-2 !justify-center !items-center">
                              <Avatar
                                src={winner.customer_image || undefined}
                                alt="Owner"
                                className="!border !border-primary-red !rounded-full !h-12 !w-12"
                              />
                              <Box>
                                <Text className="!text-base !text-secondary-text">
                                  Lucky Winner
                                </Text>
                                <Text className="!text-lg !font-bold !text-primary-red">
                                  {winner.customer_name}
                                </Text>
                              </Box>
                            </Group>
                          ) : (
                            <div className="text-center">
                              <CustomButton
                                size="lg"
                                border={false}
                                fullWidth={false}
                                variant="default"
                                rightSection={<FaMagic />}
                                onClick={startDraw}
                                disabled={
                                  !drawLineData?.draw_line
                                    ?.qualified_tickets_count ||
                                  drawLineData?.draw_line
                                    ?.qualified_tickets_count === 0 ||
                                  drawLineData?.draw_line?.status !== "open" ||
                                  selectWinnerMutation.isPending
                                }
                                loading={selectWinnerMutation.isPending}
                              >
                                <span className="!font-medium">Start Draw</span>
                              </CustomButton>
                              {drawLineData?.draw_line?.status !== "open" && (
                                <Text className="!text-sm !text-red-500 !mt-3 !text-center">
                                  This draw{" "}
                                  {drawLineData?.draw_line?.status
                                    ? `has been ${drawLineData?.draw_line?.status}`
                                    : "is not open"}
                                  .
                                </Text>
                              )}
                              {drawLineData?.draw_line?.status === "open" &&
                                (!drawLineData?.draw_line
                                  ?.qualified_tickets_count ||
                                  drawLineData?.draw_line
                                    ?.qualified_tickets_count === 0) && (
                                  <Text className="!text-sm !text-red-500 !mt-3 !text-center">
                                    You cannot start this draw: No tickets
                                    purchased for this game.
                                  </Text>
                                )}
                            </div>
                          )}
                        </div>
                      </Grid.Col>
                    </Grid>
                  </CustomTickets>
                  </div>

                  <Card withBorder mt={"xl"} radius={"md"} py={24}>
                    <div>
                      <Text tt={"capitalize"} fz={"lg"} fw={600}>
                        Raffle Draw Information
                      </Text>
                      <Text className="!text-secondary-text !text-sm">
                        Some important draw information/context are as follows
                      </Text>
                    </div>

                    <Divider my="md" />

                    <SimpleGrid
                      cols={{ base: 1, sm: 3 }}
                      spacing={{ base: 10, sm: "xl" }}
                      verticalSpacing={{ base: "md", sm: "xl" }}
                    >
                      {drawLineData && (
                        <>
                          <GridCard
                            title="Number of Ticket"
                            value={
                              drawLineData.draw_line.qualified_tickets_count
                            }
                            className="!text-[#6938EF]/50"
                            color="!text-[#6938EF]"
                          />
                          <GridCard
                            title="Number of Players"
                            value={
                              drawLineData.draw_line.unique_customers_count
                            }
                            className="!text-[#155eef]/50"
                            color="!text-[#155eef]"
                          />
                          <GridCard
                            title="Number of Potential Winners"
                            value={drawLineData.draw_line.potential_winners}
                            className="!text-[#039855]/50"
                            color="!text-[#039855]"
                          />
                        </>
                      )}
                    </SimpleGrid>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </Container>

      <UnlockDrawModal
        opened={unlockDrawModalOpen}
        onClose={() => setUnlockDrawModalOpen(false)}
        onValidate={submitUnlockPin}
        timeLeft={timeLeft}
        validatingOtp={
          verifyOtpMutation.isPending || initiateOtpMutation.isPending
        }
        resendOtp={resendOtp}
        otpLength={6}
        setTimeLeft={setTimeLeft}
        title="Unlock Draw"
        description={otpMessage}
      />

      <AdminAlertModal
        opened={unlockSuccessModalOpen}
        onClose={showDraw}
        status="success"
        title="Draw Unlocked"
        description="Draw has been successfully Unlocked"
        primaryButton={{
          label: "Close",
          onClick: showDraw,
        }}
      />

      <AdminAlertModal
        opened={videoAlertModalOpen}
        onClose={handleVideoModalClose}
        status="error"
        title="Connect External Video Feed"
        description="Kindly connect system to an external Video feed to be able to translate and sync video feed to an external source such as YouTube, Twitter. And only share visible area to the Public."
        primaryButton={{
          label: "Yes, Video Feed Connected",
          onClick: handleVideoModalClose,
        }}
        secondaryButton={{
          label: "Continue Without",
          onClick: handleVideoModalClose,
        }}
      />

      <AdminAlertModal
        opened={drawModalOpen}
        onClose={undefined}
        status="loading"
        title="Choosing a Winner at Random"
        description={
          <div className="text-center">
            <p className="block mb-5">
              Kindly wait, while the system RNG technology chooses a random
              ticket number / winner at random.
            </p>
            <p className="text-primary-red">Don't Close</p>
          </div>
        }
      />

      {/* Success Modal */}
      <AdminAlertModal
        opened={winnerSuccessModalOpen}
        onClose={() => setWinnerSuccessModalOpen(false)}
        status="success"
        title="Lucky Winner Chosen"
        description="Congratulations, a Lucky Number Winner has been chosen."
        secondaryButton={{
          label: "Close",
          onClick: () => setWinnerSuccessModalOpen(false),
        }}
      />

      {/* Error Modal for Select Winner */}
      <AdminAlertModal
        opened={selectWinnerErrorModalOpen}
        onClose={() => setSelectWinnerErrorModalOpen(false)}
        status="error"
        title="Failed to Select Winner"
        description={selectWinnerErrorMessage}
        secondaryButton={{
          label: "Close",
          onClick: () => setSelectWinnerErrorModalOpen(false),
        }}
      />
    </div>
  );
}

function GridCard({ title, value, className, color }: StatsCard) {
  return (
    <Card radius={"md"} className={`border !p-5 border-[#E7E6EC] ${className}`}>
      <Flex gap="sm" align="start">
        <BiSolidBell size={24} />
        <div>
          <Text tt="capitalize" fz="sm" className="!text-secondary-text">
            {title}
          </Text>
          <Text fw={500} className={`!font-semibold !text-3xl ${color}`}>
            {value ?? 0}
          </Text>
        </div>
      </Flex>
    </Card>
  );
}
