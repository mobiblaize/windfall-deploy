import { Tabs, Text, Title, Flex } from "@mantine/core";
import { BsPlus } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/Buttons/CustomButton";
import Roles from "./Roles";

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
          tab: "!text-secondary-text hover:!text-primary-red !transition hover:!bg-light-red !text-[14px] !font-medium data-[active=true]:!text-primary-red data-[active=true]:!border-b-2 data-[active=true]:!border-primary-red !pb-4",
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
            <Roles />
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  );
}
