import {
  Card,
  Container,
  Divider,
  Flex,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import MyGameHeader from "./MyGameHeader";
import ProfileHeader from "./ProfileHeader";
import { NavLink } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import { IconBellFilled } from "@tabler/icons-react";
import { FaAngleDown } from "react-icons/fa";

function AllNotifications() {
  return (
    <div className="text-primary-text mb-32">
      <ProfileHeader />
      <div>
        <MyGameHeader
          title="Notification"
          description="See what's going on, manage your notification, all in one place"
        >
          <Select
            data={[""]}
            placeholder="Date: all time"
            rightSection={<FaAngleDown />}
            className="w-[180px]"
          />
        </MyGameHeader>
        <Divider />
        <Container fluid className="!px-6 sm:!mx-5 md:!mx-20 lg:!mx-30">
          <SimpleGrid mt={40} mb={54} cols={1} className="!gap-7">
            {[1, 2, 3, 4].map((x) => (
              <Card
                key={x}
                withBorder
                className="!p-6 !rounded-xl !space-y-2 justify-items-start transition-shadow"
              >
                <Flex
                  columnGap="md"
                  rowGap="md"
                  justify="space-between"
                  align="center"
                  direction="row"
                  className="!flex-nowrap sm:!flex-nowrap"
                >
                  <Flex
                    gap="md"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="nowrap"
                  >
                    <div className="!inline-flex bg-secondary-red p-2 w-fit rounded-md">
                      <IconBellFilled className="!text-xl !text-primary-red" />
                    </div>
                    <div>
                      <Text className="!text-lg !font-bold !text-primary-text">
                        Notification Title
                      </Text>
                      <Text className="!text-sm !text-secondary-text">
                        This is a short one - line context of the notification,
                        that give user an insight into something before they
                        click and from here the process default them into a
                        state
                      </Text>
                    </div>
                  </Flex>
                  <div className="w-fit">
                    <NavLink to={"/raffles"}>
                      <Flex className="!text-lg" align="center" gap={14}>
                        <p className="text-red-500 text-lg font-normal hover:underline">
                          View
                        </p>
                        <GoArrowUpRight size={18} className="rounded-full !p-0 bg-black text-white" />
                      </Flex>
                    </NavLink>
                  </div>
                </Flex>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </div>
    </div>
  );
}

export default AllNotifications;
