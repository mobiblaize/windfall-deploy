import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { useOutletContext } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa";
import MyGameHeader from "./MyGameHeader";
import { PiWarningOctagonFill } from "react-icons/pi";
import GamesTicketModal from "../../components/Modals/GamesTicketModal";
import type { Crumb } from "../../components/DynamicBreadCrumbs";
import { useEffect } from "react";

type ContextType = { setCrumbs: React.Dispatch<React.SetStateAction<Crumb[]>> };
const items: Crumb[] = [
	{ label: "Game Results", to: "/profile/result" },
	{ label: "View Specific Game Result" },
];

function GameResultsTickets() {
  const { setCrumbs } = useOutletContext<ContextType>();

  useEffect(() => {
    setCrumbs(items);
  }, [setCrumbs]);

  return (
    <div>
      <MyGameHeader
        count="0"
        title="game result"
        description="A list of result pertaining to your games"
      >
        <Select
          data={[""]}
          placeholder="view: List view"
          rightSection={<FaAngleDown />}
          className="w-[180px]"
        />
      </MyGameHeader>
      <Container size="xl" mt={32}>
        <Box className="border border-primary-red rounded-xl py-4 bg-secondary-red !my-10 px-7">
          <Flex justify="space-between">
            <Group>
              <PiWarningOctagonFill className="text-primary-red text-3xl" />
              <Text>
                So sorry you didn’t win this time. Stand a Chance to Win Next
                Time.{" "}
              </Text>
            </Group>
            <Button className="!h-12 !bg-primary-text !border-2 !border-dashed !border-primary-red">
              Explore Games
            </Button>
          </Flex>
        </Box>
        <SimpleGrid
          py="lg"
          cols={{ base: 1, md: 2 }}
          spacing={{ base: 10, sm: "xl" }}
          verticalSpacing={{ base: "md", sm: "xl" }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => {
            return <GamesTicketModal item={item} key={item} />;
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
}

export default GameResultsTickets;
