import { Card, Image, Text } from "@mantine/core";
import type { Prize } from "../Admin/PrizeManagement/PrizeManagement";

function PrizesCard({ item }: { item: Prize }) {
  return (
    <Card className="!rounded-xl">
      <Card.Section className="!m-1">
        <Image
          className="!rounded-xl h-[200px]"
          src={item.image}
          alt="Norway"
        />
      </Card.Section>
      <Card.Section className="!mx-1 !my-4">
        <Text className="!capitalize !text-2xl !font-extrabold">
          {item.name}
        </Text>
        {/* <Text fz="lg" className="!text-primary-red">
          Price category:{" "}
          <span className="text-secondary-text font-medium text-sm">
            Grand price
          </span>
        </Text> */}
        <Text className="!font-light !my-4 !tracking-wide">
          {item.description}
        </Text>
      </Card.Section>
    </Card>
  );
}

export default PrizesCard;
