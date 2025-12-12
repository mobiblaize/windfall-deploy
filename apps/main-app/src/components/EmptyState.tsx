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
  width?: 1 | 2 | 3 | 4 | 5;
};

function EmptyState({
  title,
  description,
  btnText,
  redirectLink,
  format = "primary",
  fullWidth=false,
  width=2
}: props) {
  const navigate = useNavigate();
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      className={`!min-w-4/5 sm:!min-w-0 !w-${fullWidth ? 5: width}/5 !mx-auto !mt-10 !py-10 md-!px-10`}
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
            fullWidth={false}
            style={{ maxWidth: "100%" }}
            onClick={() => navigate(redirectLink)}
            className="!border !border-dashed !border-secondary-red md-!px-7 !h-12 !tracking-wide"
          >
            {btnText}
          </Button>
        )}
      </Card.Section>
    </Card>
  );
}

export default EmptyState;
