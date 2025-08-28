import { Container, Flex, Select, SimpleGrid } from "@mantine/core";
import MyGameHeader from "./MyGameHeader";
import { FaAngleDown } from "react-icons/fa";
import GamesTicketModal from "../../components/Modals/GamesTicketModal";
import { useOutletContext } from "react-router-dom";
import { type Crumb } from "../../components/DynamicBreadCrumbs";
import { useEffect } from "react";

type ContextType = { setCrumbs: React.Dispatch<React.SetStateAction<Crumb[]>> };
const items = [
	{ label: "All games", to: "/profile/all-games" },
	{ label: "View Specific Game" },
];

function GamesTickets() {
  const { setCrumbs } = useOutletContext<ContextType>();
  
  useEffect(() => {
    setCrumbs(items);
  }, [setCrumbs]);

  return (
      <div>
        <MyGameHeader
          title={"My Games Tickets"}
          description={"A list of your ticket bought for this game "}
        >
          <Flex gap={10}>
            <Select data={[]} rightSection={<FaAngleDown />} w={150} />
            <Select data={[]} rightSection={<FaAngleDown />} w={150} />
          </Flex>
        </MyGameHeader>
        <Container size="xl" mt={32}>
          <SimpleGrid
            py="lg"
            cols={{ base: 1, md: 2 }}
            spacing={{ base: 10, sm: "xl" }}
            verticalSpacing={{ base: "md", sm: "xl" }}
          >
            {[1, 2, 3, 4, 5].map((item) => {
              return <GamesTicketModal item={item} key={item} />;
            })}
          </SimpleGrid>
        </Container>
      </div>
  );
}

export default GamesTickets;
