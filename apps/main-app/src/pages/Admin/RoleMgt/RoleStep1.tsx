import { TextInput, Card, Grid, Textarea, Flex, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useEffect } from "react";
import CustomButton from "../../../components/Buttons/CustomButton";

const inputStyles = {
  input: {
    color: "#000",
    backgroundColor: "transparent",
  },
  dropdown: { color: "#000" },
};

type Step1Props = {
  name: string;
  description: string;
  setName: (prop: string) => void;
  setDescription: (prop: string) => void;
  back: () => void;
  next: () => void;
  isEdit?: boolean;
};

export default function RoleStep1({
  name,
  description,
  setName,
  setDescription,
  isEdit = false,
  back,
  next,
}: Step1Props) {
  const form = useForm({
    initialValues: {
      name,
      description,
    },
    validate: {
      name: (value) =>
        value.trim().length === 0 ? "Role name is required" : null,
      description: (value) =>
        value.trim().length === 0
          ? "Role description is required"
          : value.split(" ").length > 24
          ? "Description must not exceed 24 words"
          : null,
    },
  });

  // 🔹 Keep form in sync with parent
  useEffect(() => {
    form.setValues({ name, description });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, description]);

  const handleChange = (field: "name" | "description", value: string) => {
    form.setFieldValue(field, value);
    if (field === "name") setName(value);
    if (field === "description") setDescription(value);
  };

  const handleNext = () => {
    const isValid = form.validate();
    if (isValid.hasErrors) return;
    next();
  };

  return (
    <>
      <Card className="!bg-white !rounded-xl !border !border-gray-200 !px-6 !pt-9 !pb-4 sm:!mx-5 md:!mx-30 lg:!mx-40 !my-10 space-y-6">
        {/* Header */}
        <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
          <Grid.Col span={12}>
            <h3 className="font-bold text-xl text-primary-red">
              {isEdit ? "Edit Role" : "Create a New Role"}
            </h3>
            <p className="text-base text-secondary-text">
              {isEdit
                ? "Edit roles on the system with ease."
                : "Create a new role on the system with ease."}
            </p>
          </Grid.Col>
        </Grid>

        {/* Role Name */}
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
              value={form.values.name}
              onChange={(e) => handleChange("name", e.currentTarget.value)}
              error={form.errors.name}
            />
          </Grid.Col>
        </Grid>

        {/* Description */}
        <Grid gutter="md" className="border-b border-[#C0C0C5] !pb-6 !mb-6">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <h3 className="font-semibold text-lg text-gray-800">
              Description <span className="text-red-500">*</span>
            </h3>
            <p className="text-base text-secondary-text">Describe this role</p>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Textarea
              label="Role Description"
              placeholder="Role Description"
              withAsterisk
              value={form.values.description}
              onChange={(e) =>
                handleChange("description", e.currentTarget.value)
              }
              error={form.errors.description}
              styles={inputStyles}
            />
            <p className="text-base text-secondary-text mt-1">
              Not more than 24 words
            </p>
          </Grid.Col>
        </Grid>
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
          onClick={handleNext}
        >
          Continue
        </CustomButton>
      </Flex>
    </>
  );
}
