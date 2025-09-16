import { Tabs, Text, Title, Flex, Switch, Card } from "@mantine/core";
import { BsPlus } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton";
import { useState } from "react";

type TestRole = {
  id: number;
  name: string;
  department: string;
  users: number;
  description: string;
  active: boolean;
};

export interface Role {
  uuid: string
  name: string
  display_name: string
  guard_name?: string
  description: string
  is_active: string
  created_at: string
}

const roles: TestRole[] = [
  {
    id: 1,
    name: "Executive Role",
    department: "Operations",
    users: 32,
    description:
      "This is a short Description of this role and it is not more than two line i.e 15 words count",
    active: true,
  },
  {
    id: 2,
    name: "Executive Role",
    department: "Operations",
    users: 32,
    description:
      "This is a short Description of this role and it is not more than two line i.e 15 words count",
    active: false,
  },
  {
    id: 3,
    name: "Executive Role",
    department: "Operations",
    users: 32,
    description:
      "This is a short Description of this role and it is not more than two line i.e 15 words count",
    active: true,
  },
];

function RoleCard({ role }: { role: TestRole }) {
  const [enabled, setEnabled] = useState(role.active);

  return (
    <Card
      shadow="sm"
      radius="lg"
      padding="lg"
      className={`rounded-2xl border transition ${
        enabled
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-gray-50 opacity-70"
      }`}
    >
      <div className="flex items-center justify-between">
        <NavLink to={`/admin/roles/${role.id}`}>
          <div className="flex items-start gap-4">
            {/* Avatar with initials */}
            <span
              className={`flex items-center justify-center h-11 w-11 rounded-lg transition !font-semibold !border-3 ${
                enabled
                  ? "!bg-light-red !text-primary-red !border-[#FFBABA]"
                  : "!bg-[#FAFAFB] !border-[#ABABAB] !text-[#ABABAB]"
              }`}
            >
              ER
            </span>
            {/* Role Info */}
            <div>
              <Text className="!font-semibold !text-sm">{role.name}</Text>
              <Text className="!text-sm !text-gray-500">
                Department:{" "}
                <span className="text-gray-700">{role.department}</span>
              </Text>
              <Text className="!text-sm !text-gray-500">
                Number of User:{" "}
                <span className="!text-gray-700">{role.users}</span>
              </Text>
            </div>
          </div>
        </NavLink>

        {/* Toggle */}
        <Switch
          size="md"
          className="!cursor-pointer"
          color="#039855"
          thumbIcon={<></>}
          defaultChecked
          checked={enabled}
          onChange={(e) => setEnabled(e.currentTarget.checked)}
        />
      </div>

      {/* Description */}
      <Text className="!text-sm !text-gray-600 !mt-3 !leading-snug">
        {role.description}
      </Text>
    </Card>
  );
}

export default function RoleManagement() {
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>(); // 'users' | 'roles'
  const activeTab = section || "roles";

  const handleAddNew = () => {
    if (activeTab === "users") {
      navigate("/admin/users/create");
    } else if (activeTab === "roles") {
      navigate("/admin/roles/create");
    }
  };

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    navigate(`/admin/${value}`);
  };

  return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        classNames={{
          tab: "!text-secondary-text hover:!text-primary-red !transition !bg-white hover:!bg-light-red !text-[14px] !border-transparent !font-medium data-[active=true]:!text-primary-red hover:!border-primary-red  data-[active=true]:!border-primary-red !pb-4",
          list: "gap-6",
        }}
      >
        <div className="bg-white">
          <div className="px-6 md:px-16 pt-5 pb-2">
            <Flex mb="lg" justify="space-between">
              <div>
                <Title className="!text-primary-text text-2xl" order={2}>
                  Role Management
                </Title>
                <Text className="!text-secondary-text">
                  Manage all roles access on your system
                </Text>
              </div>
              <CustomButton
                border={false}
                className=""
                size="md"
                onClick={handleAddNew}
                rightSection={
                  <div className="!inline-flex !bg-[#ff8283] p-1 w-fit rounded-md">
                    <BsPlus className="!text-xl !text-white" />
                  </div>
                }
              >
                Add New
              </CustomButton>
            </Flex>
          </div>

          <Tabs.List className="px-6 md:px-16">
            <Tabs.Tab value="users">Manage Users</Tabs.Tab>
            <Tabs.Tab value="roles">Manage Roles</Tabs.Tab>
          </Tabs.List>
        </div>

        <div className="px-6 md:px-16">
          <Tabs.Panel value="users" pt="md">
            User management content goes here...
          </Tabs.Panel>

          <Tabs.Panel value="roles" pt="md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <RoleCard key={role.id} role={role} />
              ))}
            </div>
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}
