import { Button, Card, Divider, Grid, Image, Text } from "@mantine/core";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import type { Winner } from "./AllWinnersPage";
import { formatCurrency } from "../../utils/helper/formatCurrency";

function WinnersCard({ winner }: { winner: Winner }) {
  const navigate = useNavigate();

  return (
    <Card withBorder className="!rounded-lg">
      <Card.Section className="!m-3">
        <Image
          className="!rounded-xl h-[200px]"
          src={winner.card_image}
          alt={winner.game_name}
        />
      </Card.Section>
      <Card.Section className="!mx-3 !my-4 !text-center ">
        <Text className=" !text-secondary-text !capitalize">price won</Text>
        <Text className=" !text-primary-red !text-2xl !capitalize !font-semibold">
          {winner.prize_won}
        </Text>
        <Text my="md" className="!text-[#575757]">
          {winner.testimonial_short_description}
        </Text>
      </Card.Section>
      <Card.Section className="!mb-5 !text-center">
        <Grid className="!mt-10">
          <Grid.Col span="auto" className="!text-center">
            <Text size="md" className="!text-gray-500 !capitalize">
              Prize value
            </Text>
            <Text size="xl" className="!capitalize">
              {formatCurrency(winner.prize_cost)}
            </Text>
          </Grid.Col>
          <Divider orientation="vertical" />

          <Grid.Col span="auto">
            <Text size="md" className="!text-gray-500 !capitalize">
              raffle name
            </Text>
            <Text size="xl" className="!capitalize">
              {winner.game_name}
            </Text>
          </Grid.Col>
          <Divider orientation="vertical" />

          <Grid.Col span="auto">
            <Text size="md" className="!text-gray-500 !capitalize">
              value ticket bought
            </Text>
            <Text size="xl" className="!capitalize">
              {formatCurrency(winner.ticket_price)}
            </Text>
          </Grid.Col>
        </Grid>
      </Card.Section>
      <Button
        my="lg"
        onClick={() => navigate("/winners/" + winner.uuid)}
        rightSection={
          <GoArrowUpRight size={20} className="rounded-full p-1 bg-red-300" />
        }
        className="!bg-[#FFD5D6] !text-primary-red !h-12 !border !border-primary-red !border-dashed !tracking-wide !text-lg"
      >
        Read Exclusive Winner Story
      </Button>
    </Card>
  );
}

export default WinnersCard;
