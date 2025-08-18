import { useState } from "react";
import { Box, Button, Checkbox, Grid, Text } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";

type Props = {
  onSubmit: () => void;
  formData: {
    raffleTitle: string;
    winnerName: string;
    dob: string;
    legalName: string;
    address: string;
    email: string;
    phone: string;
  };
};

export default function ClaimPricesStep3({ onSubmit, formData }: Props) {
  const [agreed, setAgreed] = useState(false);

  const {
    raffleTitle,
    winnerName,
    dob,
    legalName,
    address,
    email,
    phone,
  } = formData;

  return (
    <Box className="relative bg-white py-8 !text-gray-900">
      <Box className="bg-red-50 border-dashed border-2 border-red-300 rounded-md p-10 md:px-25 relative">
        <div className="mb-6 flex items-center gap-2">
          <IconCircleCheck size={20} />
          <Text className="text-sm !font-medium">
            Confirm the following details before you submit
          </Text>
        </div>

        <Grid gutter="md" className="text-base text-[#2D2D2D] mb-6">
          <Grid.Col span={6}>
            <p className="font-semibold">Raffle:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{raffleTitle}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Winner:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{winnerName}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Date of birth:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{dob}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Ownership (Legal name):</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{legalName}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Address:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{address}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Email:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{email}</p>
          </Grid.Col>

          <Grid.Col span={6}>
            <p className="font-semibold">Phone:</p>
          </Grid.Col>
          <Grid.Col span={6}>
            <p>{phone}</p>
          </Grid.Col>
        </Grid>

        <div className="mt-6 flex items-start gap-2">
          <Checkbox
            checked={agreed}
            onChange={(e) => setAgreed(e.currentTarget.checked)}
            color="red"
          />
          <Text className="!text-base !text-primary-red !font-medium">
            I accept the terms, conditions and raffle policy
          </Text>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            fullWidth
            size="lg"
            disabled={!agreed}
            onClick={onSubmit}
            style={{
              backgroundColor: "#ef4444",
              color: "#fff",
              opacity: agreed ? 1 : 0.5,
              cursor: agreed ? "pointer" : "not-allowed",
            }}
            className={`text-sm font-semibold py-2 !rounded-md transition !border-2 !border-dashed !border-secondary-red ${
              agreed ? "hover:bg-primary-red" : ""
            }`}
          >
            Claim Prize
          </Button>
        </div>
      </Box>
    </Box>
  );
}
