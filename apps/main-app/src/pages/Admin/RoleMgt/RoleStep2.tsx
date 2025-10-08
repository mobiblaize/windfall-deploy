import { Card, Grid, Checkbox, Text, Flex, Button } from "@mantine/core";
import type { Permission } from "./CreateRole";
import LoadingState from "../../../components/LoadingState";
import EmptySection from "../../../components/EmptySection";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import CustomButton from "../../../components/Buttons/CustomButton";
import React from "react";

type permissionProps = {
  permissions: Permission[];
  togglePermission: (index: number) => void;
  isLoadingPermissions?: boolean;
  back: () => void;
  next: () => void;
};

type permissionItemProps = {
  perm: Permission;
  onToggle: () => void;
};

const PermissionRow = React.memo(
  ({ perm, onToggle }: permissionItemProps) => (
    <div className="border-b border-[#E4E4E7] pb-4">
      <div className="flex justify-between items-center">
        <div>
          <Text className="!font-bold">{perm.module}</Text>
          <Text className="!text-secondary-text">{perm.description}</Text>
        </div>
        <Checkbox
          label="Assign"
          color="red"
          checked={perm.is_selected}
          onChange={onToggle}
        />
      </div>
    </div>
  )
);

export default function RoleStep2({
  permissions,
  togglePermission,
  isLoadingPermissions,
  back,
  next,
}: permissionProps) {
  return (
    <>
      <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-6 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
        {/* Header */}
        <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-4 !mb-4">
          <Grid.Col span={12}>
            <h3 className="font-bold text-xl text-primary-red">Permission</h3>
            <p className="text-base text-secondary-text">
              Select multiple permission to be associated with this role i.e
              system access
            </p>
          </Grid.Col>
        </Grid>

        {/* Legend */}
        {/* <div className="border-t border-b border-dashed border-red-400 bg-red-50 py-4 px-8 grid grid-cols-2 gap-6">
        <div>
          <Text className="!text-primary-text">Can View</Text>
          <Text className="!text-secondary-text">
            User can only see the data or content but cannot make changes
          </Text>
        </div>
        <div>
          <Text className="!text-primary-text">Can Edit</Text>
          <Text className="!text-secondary-text">
            User can both view and make changes to the data or content.
          </Text>
        </div>
      </div> */}

        {/* Permission List */}
        <div className="space-y-6">
          {isLoadingPermissions && (
            <LoadingState description="Fetching permissions data from the system." />
          )}
          {
            <>
              {permissions.map((perm, idx) => (
                <PermissionRow
                  key={perm.uuid}
                  perm={perm}
                  onToggle={() => togglePermission(idx)}
                />
              ))}
              {!permissions.length && (
                <EmptySection
                  description="No permissions found"
                  title="No records found"
                />
              )}
            </>
          }
        </div>
      </Card>

      {/* Footer Buttons */}
      <Flex
        justify="flex-end"
        gap={20}
        className="!bg-white !rounded-xl !border !border-gray-200 !p-6 sm:!mx-5 md:!mx-30 lg:!mx-40 !mb-10"
      >
        <Button
          size="lg"
          fullWidth={false}
          variant="default"
          leftSection={<BsChevronLeft />}
          onClick={back}
        >
          Back
        </Button>
        <CustomButton
          size="lg"
          border={false}
          fullWidth={false}
          variant="default"
          rightSection={<BsChevronRight />}
          onClick={next}
        >
          Continue
        </CustomButton>
      </Flex>
    </>
  );
}
