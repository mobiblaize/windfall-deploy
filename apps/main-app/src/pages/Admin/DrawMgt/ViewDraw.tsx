import {
  Card,
  Text,
  Title,
  Container,
  Grid,
  Flex,
  Textarea,
  Box,
  TextInput,
  Radio,
  SimpleGrid,
  Select,
  Checkbox,
  Button,
  Divider,
  Stack,
  Avatar,
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate, useParams } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { notifications } from "@mantine/notifications";
import { useFetchData, usePutData } from "../../../utils/hooks/useApis";
import { useForm } from "@mantine/form";
import type { User } from "../UserMgt/UserMgt";
import { IconBell, IconVideo, IconWand } from "@tabler/icons-react";
import { BsChevronLeft, BsChevronRight, BsMagic } from "react-icons/bs";
import { BiSolidBell } from "react-icons/bi";
import CustomTickets from "../../../components/CustomTickets";
import { FaMagic } from "react-icons/fa";
import UnlockDrawModal from "./UnlockDrawModal";

const breadCrumbs: Crumb[] = [
  { label: "Promo Code", to: "/admin/promo-codes" },
  { label: "View Promo Code Details" },
];

type StatsCard = {
  title: string;
  value: number;
  slug: "pending" | "resolved";
  className: string;
  color: string;
};

const stats: StatsCard[] = [
  {
    title: "Number of Ticket",
    value: 10,
    slug: "resolved",
    className: "!text-[#6938EF]/50",
    color: "!text-[#6938EF]",
  },
  {
    title: "Number of Players",
    value: 20,
    slug: "pending",
    className: "!text-[#155eef]/50",
    color: "!text-[#155eef]",
  },
];

export default function ViewDraw() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [unlockDrawModalOpen, setUnlockDrawModalOpen] = useState(false);
  const [unlockSuccessModalOpen, setUnlockSuccessModalOpen] = useState(false);
  const [videoAlertModalOpen, setVideoAlertModalOpen] = useState(false);
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const [winnerSuccessModalOpen, setWinnerSuccessModalOpen] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
    const [timeLeft, setTimeLeft] = useState(300);

  const navigate = useNavigate();

  //   const {
  //     isError: isRoleError,
  //     data: roleResponse,
  //     error: roleError,
  //   } = useFetchData(`admin/user-management/roles/all?paginate=0`);

  const {
    data: userResponse,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useFetchData(`admin/user-management/users/show/${id}`);

  const updateUserMutation = usePutData(
    `admin/user-management/users/update/${id}`
  );

  function unlockDraw() {
    setUnlockDrawModalOpen(true);
  }

  function submitUnlockPin(pin: string) {
    setUnlockDrawModalOpen(false);
    setUnlockSuccessModalOpen(true);
  }

  function resendOtp() {
  }

  function showDraw() {
    setUnlockSuccessModalOpen(false);
    setStep(2);
    setVideoAlertModalOpen(true);
  }

  function drawSuccess() {
    setDrawModalOpen(false);
    setIsWon(true);
    setWinnerSuccessModalOpen(true);
  }

  function startDraw() {
    setDrawModalOpen(true);
  }



  useEffect(() => {
    if (isUserError) {
      notifications.show({
        title: "Failed to fetch User",
        message:
          (userError as { message?: string })?.message || "An error occurred",
        color: "red",
      });
    }
    if (userResponse) {
      setUser(userResponse.data?.record);
    }
  }, [userError, isUserError, userResponse]);

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        role_id: user.roles?.[0]?.uuid || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone_number: "",
      role_id: "",
    },

    validate: {
      name: (val) =>
        val.trim().split(" ").length >= 2
          ? null
          : "Enter both firstname and lastname",
      email: (val) => {
        if (!/^\S+@\S+\.\S+$/.test(val)) {
          return "Invalid email";
        }
        return null;
      },
      phone_number: (val) =>
        val.length >= 10 ? null : "Enter a valid phone number",
      role_id: (val) => (val ? null : "Select a Role"),
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    setConfirmModalOpen(true);
  };

  const updateUser = async () => {
    if (form.validate().hasErrors) {
      return;
    }

    const payload = {
      name: form.values.name,
      email: form.values.email,
      phone_number: form.values.phone_number,
      role_id: form.values.role_id,
    };

    try {
      const response = await updateUserMutation.mutateAsync(payload);
      notifications.show({
        title: "User Update Successful",
        message: response?.message || "User updated successfully",
        color: "green",
      });
      setConfirmModalOpen(false);
      setWinnerSuccessModalOpen(true);
    } catch (error) {
      notifications.show({
        title: "User Creation Failed",
        message: (error as { message: string })?.message || "An error occurred",
        color: "var(--color-primary-red)",
      });
    }
  };

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
              <Title className="!text-primary-text text-2xl" order={2}>
                Win an Instant Iphone
              </Title>
              <Text className="!text-secondary-text">
                Start Draw for this game.
              </Text>
            </div>
            <CustomButton
              size="lg"
              type="green"
              border={false}
              fullWidth={false}
              variant="default"
              rightSection={<IconVideo />}
            >
              <span className="!font-medium">Video Feed Connected</span>
            </CustomButton>
          </Flex>
        </div>
      </Card>

      <Container fluid className="!pb-10">
        <form onSubmit={form.onSubmit(handleSubmit)}>
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
                      Instructional Context Heading
                    </h3>
                    <p className="text-base text-secondary-text">
                      This a sub-text that tell us what the heading of the
                      instruction is. My MTN line is stupid, hence no service,
                      hence can't use GPT to generate the content here, But you
                      get the drift right ?
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
                      Instructional Context Heading
                    </h3>
                    <p className="text-base text-secondary-text">
                      This a sub-text that tell us what the heading of the
                      instruction is. My MTN line is stupid, hence no service,
                      hence can't use GPT to generate the content here, But you
                      get the drift right ?
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
                    buttonType="submit"
                    variant="default"
                    rightSection={<BsChevronRight />}
                    onClick={unlockDraw}
                  >
                    Start Draw
                  </CustomButton>
                </Flex>
              </Card>
            </>
          )}

          {step === 2 && (
            <>
              <div className="text-primary-text px-6 md:px-10 pb-10 pt-10">
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
                          <Text className="!text-primary-red !text-3xl !font-bold !tracking-wide break-all">
                            {isWon ? "#WF100423X8" : "**********"}
                          </Text>
                        </Box>

                        {isWon ? (
                          <Group className="mt-2 !justify-center !items-center">
                            <Avatar
                              src="https://randomuser.me/api/portraits/men/32.jpg"
                              alt="Owner"
                              className="!border !border-primary-red !rounded-full !h-12 !w-12"
                            />
                            <Box>
                              <Text className="!text-base !text-secondary-text">
                                Lucky Winner
                              </Text>
                              <Text className="!text-lg !font-bold !text-primary-red">
                                Adekunle, Ibrahim (ID:9040)
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
                            >
                              <span className="!font-medium">Start Draw</span>
                            </CustomButton>
                          </div>
                        )}
                      </div>
                    </Grid.Col>
                  </Grid>
                </CustomTickets>

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
                    cols={{ base: 1, sm: 2 }}
                    spacing={{ base: 10, sm: "xl" }}
                    verticalSpacing={{ base: "md", sm: "xl" }}
                  >
                    {stats.map((item) => (
                      <GridCard
                        key={item.slug}
                        {...{
                          ...item,
                        }}
                      />
                    ))}
                  </SimpleGrid>
                </Card>
              </div>
            </>
          )}
        </form>
      </Container>

      <UnlockDrawModal
        opened={unlockDrawModalOpen}
        onClose={() => setUnlockDrawModalOpen(false)}
        onValidate={submitUnlockPin}
        timeLeft={timeLeft}
        validatingOtp={false}
        resendOtp={resendOtp}
        setTimeLeft={setTimeLeft}
        title="Unlock Draw"
        description="Enter the OTP sent to your email  kib************windfal.com to unlock this draw. "
      />

      <AdminAlertModal
        opened={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title={<div className="!text-start">Why Resolve</div>}
        description={
          <div className="!text-start -mt-3">
            <Text className="!text-base !text-start !text-[#818181] !mb-5">
              Provide a reason as to why this resolution
              <br />
            </Text>

            <Textarea
              label="Provide more context "
              required
              placeholder="Provide more context as to why this resolution"
              autosize
              minRows={4}
              classNames={{ label: "text-xs font-medium capitalize" }}
            />
            <Text fz="xs" mt={4} c="dimmed">
              120 characters, including spaces & punctuation
            </Text>
          </div>
        }
        primaryButton={{
          label: "Yes, Resolve Case",
          onClick: () => {
            setResolveModalOpen(false);
            setConfirmModalOpen(true);
          },
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setResolveModalOpen(false),
        }}
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
        onClose={() => setVideoAlertModalOpen(false)}
        status="error"
        title="Connect External Video Feed"
        description="Kindly connect system to an external Video feed to be able to translate and sync video feed to an external source such as YouTube, Twitter. And only share visible area to the Public."
        primaryButton={{
          label: "Yes, Video Feed Connected",
          onClick: () => setVideoAlertModalOpen(false),
        }}
        secondaryButton={{
          label: "Continue Without",
          onClick: () => setVideoAlertModalOpen(false),
        }}
      />

      <AdminAlertModal
        opened={drawModalOpen}
        onClose={drawSuccess}
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
        title="Lucky Winner Chose"
        description="Congratulations, a Lucky Number Winner has been chosen."
        primaryButton={{
          label: "Proceed",
          onClick: () => setWinnerSuccessModalOpen(false),
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
