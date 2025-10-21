import { Card, Text, Image, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import emptyStateImg from "../assets/Empty-winner.png";
import cardImg from "../assets/card.png";

type props = {
  redirectLink?: string;
  title: string;
  description: string;
  btnText?: string;
  format?: "primary" | "secondary";
  fullWidth?: boolean
};

function EmptyState({
  title,
  description,
  btnText,
  redirectLink,
  format = "primary",
  fullWidth=false
}: props) {
  const navigate = useNavigate();
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      className={`!w-${fullWidth ? 5: 2}/5 !mx-auto mt-10 !p-10`}
    >
      <Card.Section className="!text-center !w-4/5 !mx-auto">
        {format === "primary" && (
          <div className="p-3 rounded-full w-fit bg-secondary-red mx-auto">
            <Image src={cardImg} w={72} h={72} />
          </div>
        )}
        {format === "secondary" && (
          <div className="p-3 rounded-full w-fit mx-auto mb-2">
            <Image src={emptyStateImg} w={150} h={150} />
          </div>
        )}
        <Text className="!font-semibold !text-2xl">{title}</Text>
        <Text className="!text-secondary-text" my="sm">
          {description}
        </Text>
        {redirectLink && btnText && (
          <Button
            onClick={() => navigate(redirectLink)}
            className="!border !border-dashed !border-secondary-red !px-7 !h-12 !tracking-wide"
          >
            {btnText}
          </Button>
        )}
      </Card.Section>
    </Card>
  );
}

export default EmptyState;
