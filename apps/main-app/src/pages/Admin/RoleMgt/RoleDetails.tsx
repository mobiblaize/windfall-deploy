import {
  Card,
  Text,
  Title,
  Grid,
  Flex,
  Switch,
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

const breadCrumbs: Crumb[] = [
  { label: "Role Management", to: "/admin/roles" },
  { label: "View Role Details" },
];

const activities = [1, 2, 3, 4, 5, 6];

export default function RoleDetails() {
  const [role, setRole] = useState({
    id: 1,
    name: "Executive Role",
    department: "Operations",
    users: 32,
    created_at: "April 11, 2005",
    created_by: "John Doe",
    description:
      "This is a short Description of this role and it is not more than two line i.e 15 words count",
    active: true,
  });
  const [deactivateAlertModalOpen, setDeactivateAlertModalOpen] =
    useState(false);
  const [deactivateSuccessModalOpen, setDeactivateSuccessModalOpen] =
    useState(false);
  const [deleteAlertModalOpen, setDeleteAlertModalOpen] = useState(false);
  const [deleteSuccessModalOpen, setDeleteSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  function closeDeleteModal() {
    setDeleteSuccessModalOpen(false);
    navigate("/admin/roles");
  }

  const roleActive = role.active;

  function setRoleActive(value: boolean) {
    setRole((prev) => ({ ...prev, active: value }));
  }

  function closeDeactivateAlertModal() {
    setDeactivateAlertModalOpen(false);
    setRoleActive(!roleActive);
    setDeactivateSuccessModalOpen(true);
  }

  function closeDeleteAlertModal() {
    setDeleteAlertModalOpen(false);
    setDeleteSuccessModalOpen(true);
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
                Role Details (ID:9044)
              </Title>
              <Text className="!text-secondary-text">
                View and manage role details
              </Text>
            </div>

            <Flex align="center" wrap="wrap" gap={20} justify="end">
              <Text className="!text-secondary-text !mr-5">Take Action</Text>

              <ActionIcon
                onClick={() => {
                  navigate("/admin/roles/edit/3");
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
                  checked={roleActive}
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
            <span
              className={`flex items-center justify-center h-11 w-11 rounded-lg transition !font-semibold !border-3 ${
                role.active
                  ? "!bg-light-red !text-primary-red !border-[#FFBABA]"
                  : "!bg-[#FAFAFB] !border-[#ABABAB] !text-[#ABABAB]"
              }`}
            >
              ER
            </span>
            <Text className="!font-semibold !text-base !text-primary-text">
              Basic Details
            </Text>
          </div>

          <Divider c="#EFEEF2" className="mb-6" />

          {/* Details Grid */}
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">Role Name</Text>
              <Text className="!font-medium !text-[#575757]">
                {role.name}
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Text className="!text-sm !text-secondary-text">Number of Users</Text>
              <Text className="!font-medium !text-[#575757]">{role.users}</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Text className="!text-sm !text-secondary-text">Department</Text>
              <Text className="!font-medium !text-[#575757]">{role.department}</Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
              <Text className="!text-sm !text-secondary-text">
                Date Created
              </Text>
              <Text className="!font-medium !text-[#575757]">
                {role.created_at}
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Text className="!text-sm !text-secondary-text">Created by</Text>
              <Text className="!font-medium !text-[#575757]">
                {role.created_by}
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 12, md: 12 }}>
              <Text className="!text-sm !text-secondary-text">Description</Text>
              <Text className="!font-medium !text-[#575757]">
                {role.description}
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
                      size={35}
                      className="!bg-[#FFD5D6] !text-primary-red !text-xl"
                    >
                      <GoArrowUpRight />
                    </ActionIcon>
                  </div>
                );
              })}
            </div>

            <Flex my="md" justify="space-between" px="lg" align="center">
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

      {/* Deactivate Alert Modal */}
      <AdminAlertModal
        opened={deactivateAlertModalOpen}
        onClose={() => setDeactivateAlertModalOpen(false)}
        status="error"
        title={`${roleActive ? "Deactivate" : "Reactivate"} Role ?`}
        description={`${roleActive ? "Are you sure you want to deactivate this role ? Kindly note that users under this role would be temporarily been revoked of their access and be assigned to system default role." : "Are you sure you want to reactivate this role ? Kindly note that users under this role would be restored of their access and be assigned back to this role."}`}
        primaryButton={{
          label: `${roleActive ? "Deactivate" : "Reactivate"} Role`,
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
        title={`Role ${roleActive ? "Reactivated" : "Deactivated"}`}
        description={`${roleActive ? "Congratulations, Role  has been successfully reactivated" : "Congratulations, Role has been successfully deactivated"}`}
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
        title={<span className="!text-primary-red">Delete Role ?</span>}
        description="Are you sure you want to delete this role? Kindly note that action is irreversible and therefore, this role would be removed / permanently deleted and it associated user access would be revoked"
        primaryButton={{
          label: "Delete Role",
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
        title="Role Deleted"
        description="Congratulations, role has been successfully Deleted"
        primaryButton={{
          label: "Close",
          onClick: closeDeleteModal,
        }}
      />
    </div>
  );
}
