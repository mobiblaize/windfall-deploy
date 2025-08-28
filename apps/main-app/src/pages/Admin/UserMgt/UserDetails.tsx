import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Switch,
  Avatar,
  Divider,
  ActionIcon,
  Table,
  Group,
  Button,
  Box,
  TextInput,
  Select,
} from "@mantine/core";
import { useState } from "react";
import AdminAlertModal from "../../../components/Modals/AdminAlertModal";
import { useNavigate } from "react-router-dom";
import DynamicBreadcrumbs, {
  type Crumb,
} from "../../../components/DynamicBreadCrumbs";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBin3Fill } from "react-icons/ri";
import TableContainer from "../../../components/TableContainer";
import { GoArrowUpRight } from "react-icons/go";
import { HiDocumentArrowDown } from "react-icons/hi2";
import { HiSearch } from "react-icons/hi";
import { IoFilterOutline } from "react-icons/io5";
import UserAction from "./UserAction";

const breadCrumbs: Crumb[] = [
  { label: "User Management", to: "/admin/users" },
  { label: "View User Details" },
];

const activities = [1, 2, 3, 4, 5, 6];

export default function UserDetails() {
  const [userActive, setUserActive] = useState(true);
  const [userActionModalOpen, setUserActionModalOpen] = useState(false);
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);
  const user = {
    avatar: "https://i.pravatar.cc/100", // replace with actual image
    username: "Adekunle Ibrahim",
    role: "Operations",
    email: "ola@winit.com",
    departmentHead: "Yes.",
    dateCreated: "April 4, 2020",
    createdBy: "Hameedat A.Y",
    department: "Product & Sale",
    lastActive: "April 11, 2024",
  };

  const navigate = useNavigate();

  function closeDeleteModal() {
    setDeleteSuccessModalOpen(false);
    navigate("/admin/users");
  }

  function closeDeactivateAlertModal() {
    setDeactivateAlertModalOpen(false);
    setUserActive(!userActive);
    setDeactivateSuccessModalOpen(true);
  }

  function closeDeleteAlertModal() {
    setDeleteAlertModalOpen(false);
    setDeleteSuccessModalOpen(true);
  }

  function showUserAction() {
    setUserActionModalOpen(true);
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-16 py-1">
          <DynamicBreadcrumbs items={breadCrumbs} />
        </div>
      </Card>
      <Card className="bg-white !border-b !p-0 !border-b-gray-200">
        <div className="px-6 md:px-16 pt-7 pb-2 mb-7">
          <Flex justify="space-between" align="center">
            <div>
              <Title className="!text-primary-text text-2xl" order={2}>
                Sodiq Olalekan (ID:9044)
              </Title>
              <Text className="!text-secondary-text">
                View and manage user details
              </Text>
            </div>

            <Flex align="center" wrap="wrap" gap={20} justify="end">
              <Text className="!text-secondary-text !mr-5">Take Action</Text>

              <ActionIcon
                onClick={() => {
                  navigate("/admin/users/edit/3");
                }}
                size={35}
                className="!text-[#4313F7] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#F4F3FF] !h-10 !w-10 !flex !items-center !justify-center"
              >
                <FaUserEdit />
              </ActionIcon>

              <span className="!cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-lg !bg-[#EDFCF2] !h-10 !w-10 !flex !items-center !justify-center">
                <Switch
                  size="sm"
                  onClick={() => {
                    setDeactivateAlertModalOpen(true);
                  }}
                  checked={userActive}
                  className="!cursor-pointer"
                  color="#13F7B5"
                  thumbIcon={<></>}
                />
              </span>
              <ActionIcon
                onClick={() => {
                  setDeleteAlertModalOpen(true);
                }}
                size={35}
                className="!text-[#F71355] !cursor-pointer !border-1 !rounded-lg !border-[#EBE9FE] !text-xl !bg-[#FFF1F3] !h-10 !w-10 !flex !items-center !justify-center"
              >
                <RiDeleteBin3Fill />
              </ActionIcon>
            </Flex>
          </Flex>
        </div>
      </Card>

      <div className="px-6 md:px-16 pt-10 pb-10 ">
        <Card
          shadow="sm"
          radius="lg"
          p="lg"
          className="w-full rounded-2xl border !mb-10 border-gray-200"
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <Avatar
              src={user.avatar}
              alt="Profile"
              radius="md"
              size={40}
              className="!border-3 border-primary-red rounded-lg"
            />
            <Text className="!font-semibold !text-base !text-primary-text">
              Basic Details
            </Text>
          </div>

          <Divider c="#EFEEF2" className="mb-6" />

          {/* Details Grid */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">Username</Text>
              <Text className="!font-medium !text-[#575757]">
                {user.username}
              </Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Role</Text>
              <Text className="!font-medium !text-[#575757]">{user.role}</Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="mantine-md:border-l mantine-md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Email</Text>
              <Text className="!font-medium !text-[#575757]">{user.email}</Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">
                Department Head
              </Text>
              <Text className="!font-medium !text-[#575757]">
                {user.departmentHead}
              </Text>
            </Grid.Col>
          </Grid>

          <Grid gutter="xl" className="md:mt-8 mb-4 pt-8 md:!border-t md:!border-gray-200">
            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
            >
              <Text className="!text-sm !text-secondary-text">
                Date Created
              </Text>
              <Text className="!font-medium !text-[#575757]">
                {user.dateCreated}
              </Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Created by</Text>
              <Text className="!font-medium !text-[#575757]">
                {user.createdBy}
              </Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="mantine-md:border-l mantine-md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Department</Text>
              <Text className="!font-medium !text-[#575757]">
                {user.department}
              </Text>
            </Grid.Col>

            <Grid.Col
              span={{ base: 12, sm: 6, md: 3 }}
              className="md:border-l md:border-gray-200"
            >
              <Text className="!text-sm !text-secondary-text">Last Active</Text>
              <Text className="!font-medium !text-[#575757]">
                {user.lastActive}
              </Text>
            </Grid.Col>
          </Grid>
        </Card>

        <section className="text-secondary-text">
          <Box className="border !border-secondary-text/50 rounded-xl bg-white">
            <Flex justify="space-between" px="md" pt="lg" wrap="wrap" gap={8}>
              <div>
                <Text fz={20} fw="bold" className="!text-primary-red">
                  User activities
                </Text>
                <Text className="!text-secondary-text">
                  Track and manage user activity within platform
                </Text>
              </div>
              <Button
                variant="outline"
                className="!border-secondary-text/50 !text-secondary-text !rounded-lg !text-sm !h-12"
                rightSection={<HiDocumentArrowDown />}
              >
                Export
              </Button>
            </Flex>

            <Divider mt="md" mb="lg" />

            <Flex
              justify="space-between"
              px="md"
              mb="lg"
              wrap="wrap"
              gap={8}
              align="center"
            >
              <TextInput
                leftSection={<HiSearch />}
                placeholder="Search"
                className="!w-72 !rounded-xl shadow-md"
              />
              <Group>
                <Select
                  rightSection={<IoFilterOutline />}
                  placeholder="sort by: show all"
                  className="!shadow-md"
                />
                <Select
                  rightSection={<IoFilterOutline />}
                  placeholder="filter by: show all"
                  className="!shadow-md"
                />
              </Group>
            </Flex>

            {/* Table for larger screens */}
            <div className="!hidden sm:!block">
              <TableContainer
                headers={["Date", "Time", "Affected Module", "Action Type", ""]}
              >
                {activities.map((x) => {
                  return (
                    <Table.Tr key={x}>
                      <Table.Td>
                        <Text className="!text-base !font-medium">
                          April 11, 2005
                        </Text>
                      </Table.Td>
                      <Table.Td className="!pr-0">
                        <Text className="!text-secondary-text !pr-0 !text-sm">
                          11:00am
                        </Text>
                      </Table.Td>
                      <Table.Td className="!pr-0">Game Management</Table.Td>
                      <Table.Td className="!pr-0">
                        <Text className="!text-base">Create Game</Text>
                      </Table.Td>
                      <Table.Td>
                        <ActionIcon
                          onClick={showUserAction}
                          size={35}
                          className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                        >
                          <GoArrowUpRight />
                        </ActionIcon>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </TableContainer>
            </div>

            {/* Card view for small screens */}
            <div className="sm:!hidden space-y-4 p-4">
              {activities.map((x) => {
                const active = x % 2;
                return (
                  <div
                    key={x}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white space-y-2"
                  >
                    <p>
                      <strong>Transaction ID:</strong> 4HYE74793FS
                    </p>
                    <p>
                      <strong>Date:</strong> April 11, 2005 — 11:00am
                    </p>
                    <p className="flex items-center gap-2">
                      <strong>Paid via:</strong>{" "}
                    </p>
                    <p>
                      <strong>Value:</strong> ₦ 10,000
                    </p>
                    <p>
                      <strong>Channel:</strong> Paystack
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`py-[2px] px-2 rounded-xl inline-block font-medium ${
                          active
                            ? "bg-[#CCFBEF] text-[#06B280]"
                            : "bg-[#FEF3F2] text-[#B42318]"
                        }`}
                      >
                        {active ? "Successful" : "Failed"}
                      </span>
                    </p>
                    <ActionIcon
                      onClick={showUserAction}
                      size={35}
                      className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                    >
                      <GoArrowUpRight />
                    </ActionIcon>
                  </div>
                );
              })}
            </div>

            <Flex
              my="md"
              justify="space-between"
              gap={2}
              wrap="wrap"
              px="lg"
              align="center"
            >
              <Text>Page 1 of 10</Text>
              <Group>
                <Button
                  variant="outline"
                  className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="!border-secondary-text/50 hover:!bg-secondary-text/10 !text-secondary-text"
                >
                  Next
                </Button>
              </Group>
            </Flex>
          </Box>
        </section>
      </div>

      {/* Success Modal */}
      <UserAction
        opened={userActionModalOpen}
        onClose={() => setUserActionModalOpen(false)}
      />

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${userActive ? "Deactivate" : "Reactivate"} User ?`}
        description={`${userActive ? "Are you sure you want to deactivate this user ? Kindly note that action would translate to this user access being temporarily revoked until their account is manually reactivated again" : "Are you sure you want to reactivate this user ? Kindly note that action would translate to this user revoked access being restored"}`}
        primaryButton={{
          label: `${userActive ? "Deactivate" : "Reactivate"} User`,
          onClick: closeDeactivateAlertModal,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeactivateAlertModalOpen(false),
        }}
      />

      {/* Deactivate Success Modal */}
      <AdminAlertModal
        opened={deactivateSuccessModalOpen}
        onClose={() => setDeactivateSuccessModalOpen(false)}
        status="success"
        title={`User ${userActive ? "Activated" : "Deactivated"}`}
        description={`User profile has been successfully ${userActive ? "activated" : "deactivated"} and their access to the platform has been ${userActive ? "restored." : "revoked temporarily."}`}
        primaryButton={{
          label: "Close",
          onClick: () => setDeactivateSuccessModalOpen(false),
        }}
      />

      {/* Delete Alert Modal */}
      <AdminAlertModal
        opened={deleteAlertModalOpen}
        onClose={() => setDeleteAlertModalOpen(false)}
        status="delete"
        title={<span className="!text-primary-red">Delete User ?</span>}
        description="Are you sure you want to delete this user ? Kindly note that action is irreversible and therefore, this user would be removed / permanently deleted and their access revoked"
        primaryButton={{
          label: "Delete User",
          onClick: closeDeleteAlertModal,
        }}
        secondaryButton={{
          label: "Close",
          onClick: () => setDeleteAlertModalOpen(false),
        }}
      />

      {/* Delete Success Modal */}
      <AdminAlertModal
        opened={deleteSuccessModalOpen}
        onClose={closeDeleteModal}
        status="success"
        title="User Deleted"
        description="User profile has been successfully Deleted and their access revoked."
        primaryButton={{
          label: "Close",
          onClick: closeDeleteModal,
        }}
      />
    </div>
  );
}
