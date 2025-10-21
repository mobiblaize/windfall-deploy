import { Text, Image, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import cardImg from "../assets/card.png";
import emptyStateImg from "../assets/empty-state.png";

type props = {
  redirectLink?: string;
  title: string;
  description: string;
  btnText?: string;
  format?: "primary" | "secondary";
  fullWidth?: boolean
};

function EmptySection({
  title,
  description,
  btnText = "Okay",
  redirectLink,
  format = "primary",
  fullWidth=false
}: props) {
  const navigate = useNavigate();
  return (
    <div className={`!w-${fullWidth ? 5: 4}/5 !mx-auto mt-10 !p-10`}>
      <div className="!text-center !mx-auto">
        {format === "primary" && (
          <div className="p-3 rounded-full w-fit mx-auto">
            <Image src={cardImg} w={72} h={72} />
          </div>
        )}
        {format === "secondary" && (
          <div className="p-3 rounded-full w-fit mx-auto mb-2">
            <Image src={emptyStateImg} w={150} h={150} />
          </div>
        )}
        <Text className="!font-semibold !text-primary-text !text-2xl">
          {title}
        </Text>
        <Text className="!text-secondary-text" my="sm">
          {description}
        </Text>
        {redirectLink && (
          <Button
            onClick={() => navigate(redirectLink)}
            className="!border !border-dashed !border-secondary-red !px-7 !h-12 !tracking-wide"
          >
            {btnText}
          </Button>
        )}
      </div>
    </div>
  );
}

export default EmptySection;
