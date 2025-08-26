import {
  TextInput,
  Card,
  Grid,
  Textarea,
} from "@mantine/core";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

type step1Props = {
    name: string;
    description: string;
    setName: (prop: string) => void;
    setDescription: (prop: string) => void;
    isEdit?: boolean;
};

export default function RoleStep1({ name, description, setName, setDescription, isEdit=false }: step1Props) {

  return (
        <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
          {/* User Name */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={12}>
              <h3 className="font-bold text-xl text-primary-red">
                {isEdit ? 'Edit Role': 'Create a New Role'}
              </h3>
              <p className="text-base text-secondary-text">{isEdit ? 'Edit roles on the system with ease.': 'Create a new role on the system with ease.'}</p>
            </Grid.Col>
          </Grid>
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Role Name <span className="text-red-500">*</span>
              </h3>
              <p className="text-base text-secondary-text">Enter a unique name</p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <TextInput
                label="Role Name"
                placeholder="Role Name"
                withAsterisk
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
              />
            </Grid.Col>
          </Grid>

          {/* Email Address */}
          <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
            <Grid.Col span={{ base: 12, md: 5 }}>
              <h3 className="font-semibold text-lg text-gray-800">
                Description <span className="text-red-500">*</span>
              </h3>
              <p className="text-base text-secondary-text">
                Describe this role
              </p>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Textarea 
                label="Role Description"
                placeholder="Role Description"
                withAsterisk
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                styles={inputStyles} />
              <p className="text-base text-secondary-text mt-1">Not more than 24 words</p>
            </Grid.Col>
          </Grid>

        </Card>
  );
}
