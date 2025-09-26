import { Flex, Text } from "@mantine/core";
import type { Item } from "./Cart";
import { formatCurrency } from "../../utils/helper/formatCurrency";

function CheckoutItem({ item }: { item: Item }) {
  return (
    <div className=" border-2 border-dashed border-secondary-text rounded-xl py-5 px-5">
      <Text fz="lg" fw={600}>
        {item.game_name}
      </Text>
      <Text className="!text-secondary-text">
        {item.description}
      </Text>
      <Flex justify="space-around" my="md">
        <div className="text-center capitalize">
          <Text fw={100} className="!text-secondary-text">
            QTY
          </Text>
          <Text fw={500}>{item.quantity} units</Text>
        </div>
        <div className="text-center capitalize">
          <Text fw={100} className="!text-secondary-text">
            unit price
          </Text>
          <Text fw={500}>{formatCurrency(item.unit_price)}</Text>
        </div>
        <div className="text-center capitalize">
          <Text fw={100} className="!text-secondary-text">
            total price
          </Text>
          <Text fw={500}>{formatCurrency(item.total_price)}</Text>
        </div>
      </Flex>
    </div>
  );
}

export default CheckoutItem;
