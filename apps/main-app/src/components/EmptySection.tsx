import { Text, Image, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import cardImg from "../assets/card.png";

type props = {
  redirectLink?: string;
  title: string;
  description: string;
  btnText?: string;
};

function EmptySection({ title, description, btnText="Okay", redirectLink}: props) {
  const navigate = useNavigate();
  return (
    <div
      className="!w-4/5 !mx-auto mt-10 !p-10"
    >
      <div className="!text-center !mx-auto">
        <div className="p-3 rounded-full w-fit mx-auto">
          <Image src={cardImg} w={72} h={72} />
        </div>
        <Text className="!font-semibold !text-primary-text !text-2xl">{title}</Text>
        <Text className="!text-secondary-text" my="sm">
          {description}
        </Text>
        {redirectLink && <Button
          onClick={() => navigate(redirectLink)}
          className="!border !border-dashed !border-secondary-red !px-7 !h-12 !tracking-wide"
        >
          {btnText}
        </Button>}
      </div>
    </div>
  );
}

export default EmptySection;
