import { useState } from "react";
import { Card, Avatar, Switch, Text, Flex } from "@mantine/core";
import { NavLink } from "react-router-dom";

type User = {
  id: number;
  name: string;
  role: string;
  active: boolean;
  avatar?: string;
};

const users: User[] = [
  { id: 1, name: "Adekunle, Ibrahim", role: "Operation Manager", active: true },
  { id: 2, name: "Njeri, Mwatthethe", role: "HR Specialist", active: true },
  { id: 3, name: "Patel, Suresh", role: "IT Technician", active: true },
  { id: 4, name: "Johnson, Emily", role: "Sales Executive", active: true },
  { id: 5, name: "Wu, Li", role: "Marketing Specialist", active: true },
  { id: 6, name: "Chen, Wei", role: "Software Engineer", active: true },
  { id: 7, name: "Davis, Sarah", role: "Graphic Designer", active: true },
  { id: 8, name: "Liang, Chen", role: "Marketing Coordinator", active: false },
  { id: 9, name: "Kumar, Anjali", role: "Customer Service Rep", active: false },
  { id: 10, name: "Baker, Samuel", role: "Product Developer", active: false },
  { id: 11, name: "Patel, Aisha", role: "UX Designer", active: false },
  { id: 12, name: "Nguyen, Mia", role: "Project Manager", active: false },
  { id: 13, name: "Martinez, Luis", role: "Systems Analyst", active: false },
  { id: 14, name: "Santos, Maria", role: "Financial Analyst", active: false },
  { id: 15, name: "Nguyen, Minh", role: "Logistics Manager", active: false },
  { id: 16, name: "Garcia, Elena", role: "Legal Advisor", active: false },
  { id: 17, name: "Smith, John", role: "Data Analyst", active: false },
  { id: 18, name: "Lopez, Carlos", role: "Content Writer", active: false },
  { id: 19, name: "Brown, Kevin", role: "Operations Manager", active: false },
];

export default function Users() {
  const [userList, setUserList] = useState(users);

  const toggleUser = (id: number) => {
    setUserList((prev) =>
      prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userList.map((user) => (
        <Card
          key={user.id}
          radius="lg"
          className="!shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] !rounded-xl p-10"
        >
          <Flex justify="space-between" align="center" gap={5}>
            <Flex gap={10}>
              <Avatar
                src="/assets/profile.jpg"
                alt="Profile"
                radius="md"
                size={40}
                className="border-3 border-primary-red rounded-lg"
              />
              <div>
                <Text className="!font-medium !text-primary-red !text-sm">
                  <NavLink to={"/admin/users/3"}>{user.name}</NavLink>
                </Text>
                <Text className="!text-secondary-text !text-sm">
                  Role: <span className="!text-[#575757]"><NavLink to={"/admin/users/3"}>{user.role}</NavLink></span>
                </Text>
              </div>
            </Flex>
            <Switch
              size="md"
              className="!cursor-pointer"
              color="#039855"
              thumbIcon={<></>}
              defaultChecked
              checked={user.active}
              onChange={() => toggleUser(user.id)}
            />
          </Flex>
        </Card>
      ))}
    </div>
  );
}
