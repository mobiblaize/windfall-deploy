import { Card, Grid, Checkbox, Text } from "@mantine/core";
import type { Permission } from "./CreateRole";

type permissionProps = {
  permissions: Permission[];
  togglePermission: (index: number, field: "canView" | "canEdit") => void;
};

export default function RoleStep2({
  permissions,
  togglePermission,
}: permissionProps) {
  return (
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
      <div className="border-t border-b border-dashed border-red-400 bg-red-50 py-4 px-8 grid grid-cols-2 gap-6">
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
      </div>

      {/* Permission List */}
      <div className="space-y-6">
        {permissions.map((perm, idx) => (
          <div key={idx} className="border-b border-[#E4E4E7] pb-4">
            <div className="flex justify-between items-center">
              <div>
                <Text className="!font-bold">{perm.module}</Text>
                <Text className="!text-secondary-text">{perm.description}</Text>
              </div>
              <div className="flex gap-6">
                <Checkbox
                  label="Can View"
                  color="red"
                  checked={perm.canView}
                  onChange={() => togglePermission(idx, "canView")}
                  className="!text-red-600"
                />
                <Checkbox
                  label="Can Edit"
                  color="red"
                  checked={perm.canEdit}
                  onChange={() => togglePermission(idx, "canEdit")}
                  className="!text-red-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
