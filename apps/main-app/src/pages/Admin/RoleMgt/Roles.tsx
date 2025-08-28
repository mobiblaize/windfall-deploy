import { Card, Switch, Text } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";

type Role = {
  id: number;
  name: string;
  department: string;
  users: number;
  description: string;
  active: boolean;
};

const roles: Role[] = [
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

function RoleCard({ role }: { role: Role }) {
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

export default function Roles() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role) => (
        <RoleCard key={role.id} role={role} />
      ))}
    </div>
  );
}
